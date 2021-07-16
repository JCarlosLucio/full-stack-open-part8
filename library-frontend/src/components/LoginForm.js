import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { LOGIN } from '../queries';
import storage from '../utils/storage';

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      storage.saveToken(token);
    }
  }, [result.data]); //eslint-disable-line

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setUsername('');
    setPassword('');
    setPage('authors');
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  show: PropTypes.bool.isRequired,
  setToken: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default LoginForm;
