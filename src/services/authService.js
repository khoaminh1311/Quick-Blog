// src/services/authService.js
// Authentication API calls: register, login, getCurrentUser.
// Callers are responsible for saving tokens/user to localStorage.

import apiClient, { authHeader } from './apiClient';

/**
 * Register a new user account.
 *
 * POST /api/auth/register
 * Body: { email, username, password }
 * Response: { user, accessToken }
 *
 * @param {{ email: string, username: string, password: string }} credentials
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function register(credentials) {
  const response = await apiClient.post('/api/auth/register', credentials);
  return response.data;
}

/**
 * Log in with email and password.
 *
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { accessToken, refreshToken }
 *
 * Note: The login response does NOT include user or role.
 * Call getCurrentUser() after login to retrieve the logged-in user.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export async function login(credentials) {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
}

/**
 * Fetch the currently authenticated user.
 *
 * GET /api/auth/me
 * Requires: Bearer access token in the Authorization header.
 * Response: { user: { id, role, email, username } }
 *
 * @param {string} accessToken - The caller's JWT access token.
 * @returns {Promise<{ user: { id: string, role: string, email: string, username: string } }>}
 */
export async function getCurrentUser(accessToken) {
  const response = await apiClient.get('/api/auth/me', authHeader(accessToken));
  return response.data;
}
