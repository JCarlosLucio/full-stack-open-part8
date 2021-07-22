import { useQuery } from '@apollo/client';
import { BOOKS_BY_GENRE, ME } from '../queries';
import PropTypes from 'prop-types';

const Recommendations = ({ show }) => {
  const { loading, data } = useQuery(ME);

  const { loading: loadingBooks, data: dataBooks } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: data && data.me.favoriteGenre },
    skip: !data,
  });

  if (!show) {
    return null;
  }

  if (loading || loadingBooks) {
    return <div>loading...</div>;
  }

  const favoriteGenre = data.me.favoriteGenre;

  const recommended = dataBooks.allBooks;

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
