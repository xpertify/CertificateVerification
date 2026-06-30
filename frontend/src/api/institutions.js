import { apiFetch } from './client.js';

export function addInstitution(data, token) {
  return apiFetch('POST', '/api/institutions', { body: data, token });
}

export function getInstitutions(token) {
  return apiFetch('GET', '/api/institutions', { token });
}
