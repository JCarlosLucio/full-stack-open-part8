import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR } from '../queries';

const BirthyearForm = () => {
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
        <div>
          name
          <input
            id="name"
            name="name"
            value={name}
            type="text"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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

export default BirthyearForm;
