import { jsonRequest } from './api';

export const registerUser = async (userData) => jsonRequest('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});

export const loginUser = async (credentials) => jsonRequest('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});
