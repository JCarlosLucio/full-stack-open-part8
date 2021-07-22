import { useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  BOOKS_BY_GENRE,
  CREATE_BOOK,
  ME,
} from '../queries';

const NewBook = ({ show, setPage }) => {
  const [title, setTitle] = useState('');
  const [author, setAuhtor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    update: (store, response) => {
      const authorsInStore = store.readQuery({ query: ALL_AUTHORS });
      const booksInStore = store.readQuery({ query: ALL_BOOKS });
      const meInStore = store.readQuery({ query: ME });
      const booksByGenreInStore = store.readQuery({
        query: BOOKS_BY_GENRE,
        variables: { genre: meInStore.me.favoriteGenre },
      });

      // update bookCount of author
      store.writeQuery({
        query: ALL_AUTHORS,
        data: {
          ...authorsInStore,
          allAuthors: authorsInStore.allAuthors.map((a) =>
            a.name === author ? { ...a, bookCount: a.bookCount + 1 } : a
          ),
        },
      });

      // update books list with addedBook
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...booksInStore,
          allBooks: [...booksInStore.allBooks, response.data.addBook],
        },
      });

      // update recommended book list if book is from favorite genre
      if (genres.includes(meInStore.me.favoriteGenre)) {
        store.writeQuery({
          query: BOOKS_BY_GENRE,
          variables: { genre: meInStore.me.favoriteGenre },
          data: {
            ...booksByGenreInStore,
            allBooks: [...booksByGenreInStore.allBooks, response.data.addBook],
          },
        });
      }
    },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    createBook({
      variables: { title, author, published: parseInt(published, 10), genres },
    });

    setTitle('');
    setPublished('');
    setAuhtor('');
    setGenres([]);
    setGenre('');
    setPage('books');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

NewBook.propTypes = {
  show: PropTypes.bool.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default NewBook;
