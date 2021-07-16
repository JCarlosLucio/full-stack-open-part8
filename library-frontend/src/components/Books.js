import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_BOOKS } from '../queries';

const Books = ({ show }) => {
  const [filter, setFilter] = useState(null);
  const result = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = [...new Set(books.flatMap((book) => book.genres))];

  const filtered = filter
    ? books.filter((book) => book.genres.includes(filter))
    : books;

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{filter ? filter : 'all genres'}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filtered.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setFilter(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
