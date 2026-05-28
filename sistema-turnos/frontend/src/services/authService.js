import { http } from './apiClient';

export const authService = {
  login: (credentials) => http.post('/auth/login', credentials, { skipAuth: true }),
  me: () => http.get('/auth/me'),
};
