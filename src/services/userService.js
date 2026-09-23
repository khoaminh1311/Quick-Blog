// src/services/userService.js
// Admin user management API calls: list users, change role, delete user.
// Every function requires an access token from the caller.

import apiClient, { authHeader } from './apiClient';

/**
 * Get all users (admin only).
 *
 * GET /api/users
 * Requires: Bearer access token.
 * Response: { items, page, limit, total, totalPages }
 *
 * @param {string} accessToken
 * @returns {Promise<{ items: object[], page: number, limit: number, total: number, totalPages: number }>}
 */
export async function getUsers(accessToken) {
  const response = await apiClient.get('/api/users', authHeader(accessToken));
  return response.data;
}

/**
 * Change a user's role (admin only).
 *
 * PUT /api/users/:id/role
 * Requires: Bearer access token.
 * Body: { role }
 * Valid role values: 'user', 'admin'
 * Response: confirmed shape unknown — raw data returned as-is.
 *
 * @param {string} userId
 * @param {'user' | 'admin'} role
 * @param {string} accessToken
 * @returns {Promise<object>}
 */
export async function updateUserRole(userId, role, accessToken) {
  const response = await apiClient.put(
    `/api/users/${userId}/role`,
    { role },
    authHeader(accessToken)
  );
  return response.data;
}

/**
 * Delete a user account (admin only).
 *
 * DELETE /api/users/:id
 * Requires: Bearer access token.
 * Response: confirmed shape unknown — raw data returned as-is.
 *
 * @param {string} userId
 * @param {string} accessToken
 * @returns {Promise<object>}
 */
export async function deleteUser(userId, accessToken) {
  const response = await apiClient.delete(`/api/users/${userId}`, authHeader(accessToken));
  return response.data;
}
