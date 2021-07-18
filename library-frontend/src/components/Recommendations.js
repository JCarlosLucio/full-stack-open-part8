import { useApolloClient, useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';
import PropTypes from 'prop-types';

const Recommendations = ({ show }) => {
  const client = useApolloClient();

  const { loading, data } = useQuery(ME);

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  const books = client.readQuery({ query: ALL_BOOKS }).allBooks;

  const favoriteGenre = data.me.favoriteGenre;

  const recommended = books.filter((book) =>
    book.genres.includes(favoriteGenre)
  );

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommended.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Recommendations.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Recommendations;
