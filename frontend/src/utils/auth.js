export const saveToken = (token) => {
  localStorage.setItem('access_Token', token.access);
  localStorage.setItem('refresh_Token', token.refresh);
};

export const clearToken = () => {
  localStorage.removeItem('access_Token');
  localStorage.removeItem('refresh_Token');
}

export const getAccessToken = () => {
  return localStorage.getItem('access_Token');
}

export const authFetch = (url, options = {}) => {
  const token = getAccessToken();
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['Content-Type'] = 'application/json';
  return fetch(url, { ...options, headers });
}