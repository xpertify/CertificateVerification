import { apiFetch } from './client.js';

export function login(email, password) {
  return apiFetch('POST', '/api/auth/login', { body: { email, password } });
}
