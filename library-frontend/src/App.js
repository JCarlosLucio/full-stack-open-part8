import React, { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
import storage from './utils/storage';
import { useApolloClient, useSubscription } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED, BOOKS_BY_GENRE, ME } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);
    const booksInStore = client.readQuery({ query: ALL_BOOKS });

    // update book list with addedBook
    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: [...booksInStore.allBooks, addedBook] },
      });
    }

    // TODO - update bookCount of author

    // update recommended book list if book is from favorite genre
    if (token) {
      const meInStore = client.readQuery({ query: ME });
      const booksByGenreInStore = client.readQuery({
        query: BOOKS_BY_GENRE,
        variables: { genre: meInStore.me.favoriteGenre },
      });

      if (
        addedBook.genres.includes(meInStore.me.favoriteGenre) &&
        !includedIn(booksByGenreInStore.allBooks, addedBook)
      ) {
        client.writeQuery({
          query: BOOKS_BY_GENRE,
          variables: { genre: meInStore.me.favoriteGenre },
          data: {
            allBooks: [...booksByGenreInStore.allBooks, addedBook],
          },
        });
      }
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCacheWith(addedBook);
    },
  });

  useEffect(() => {
    const token = storage.loadToken();
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setPage('authors');
    setToken(null);
    storage.clearToken();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && (
          <React.Fragment>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>
              recommend
            </button>
          </React.Fragment>
        )}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook
        show={page === 'add'}
        setPage={setPage}
        updateCacheWith={updateCacheWith}
      />

      {token && <Recommendations show={page === 'recommendations'} />}

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
