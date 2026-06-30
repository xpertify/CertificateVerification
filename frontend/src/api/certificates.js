import { apiFetch } from './client.js';

export function issueCertificate(data, token) {
  return apiFetch('POST', '/api/certificates', { body: data, token });
}

export function verifyCertificate(certId) {
  return apiFetch('GET', `/api/certificates/verify/${encodeURIComponent(certId)}`);
}

export function getMyCertificates(token) {
  return apiFetch('GET', '/api/certificates', { token });
}

export function revokeCertificate(certId, token) {
  return apiFetch('POST', `/api/certificates/${encodeURIComponent(certId)}/revoke`, { body: {}, token });
}
