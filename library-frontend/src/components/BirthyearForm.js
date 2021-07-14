import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR } from '../queries';
import PropTypes from 'prop-types';

const BirthyearForm = ({ authors }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR);

  const submit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: parseInt(born, 10) } });

    setName('');
    setBorn('');
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <select
          id="authors"
          name="authors"
          value={name}
          onChange={({ target }) => setName(target.value)}
        >
          <option value="" disabled>
            Choose an author...
          </option>
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <div>
          born
          <input
            id="born"
            name="born"
            value={born}
            type="text"
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

BirthyearForm.propTypes = {
  authors: PropTypes.array.isRequired,
};

export default BirthyearForm;
