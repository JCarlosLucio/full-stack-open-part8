const storageKey = 'library-user-token';

export const saveToken = (token) =>
  window.localStorage.setItem(storageKey, token);

export const loadToken = () => window.localStorage.getItem(storageKey);

export const clearToken = () => window.localStorage.removeItem(storageKey);

const storage = { saveToken, loadToken, clearToken };

export default storage;
