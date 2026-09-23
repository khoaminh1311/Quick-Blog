// src/services/apiClient.js
// Single Axios instance for the entire app.
// All service files import from here; never hard-code the base URL elsewhere.

import axios from 'axios';

/**
 * Axios instance pre-configured with the API base URL.
 * Do not add interceptors or localStorage reads here.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * Returns an Axios request-config object that includes the Bearer
 * Authorization header.
 *
 * Usage:
 *   apiClient.get('/api/posts', authHeader(token))
 *   apiClient.post('/api/posts', payload, authHeader(token))
 *
 * @param {string} accessToken - JWT access token supplied by the caller.
 * @returns {{ headers: { Authorization: string } }}
 */
export function authHeader(accessToken) {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export default apiClient;
