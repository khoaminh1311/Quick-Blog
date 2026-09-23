// src/services/postService.js
// Post API calls: list, list by user, detail, create, delete.
// Callers pass the access token; this file does not read localStorage.

import apiClient, { authHeader } from './apiClient';

/**
 * Get all posts (paginated).
 *
 * GET /api/posts
 * Requires: Bearer access token.
 * Response: { items, page, limit, total, totalPages }
 *
 * Do not add unconfirmed query parameters (search, filter, etc.).
 *
 * @param {string} accessToken
 * @returns {Promise<{ items: object[], page: number, limit: number, total: number, totalPages: number }>}
 */
export async function getPosts(accessToken) {
  const response = await apiClient.get('/api/posts', authHeader(accessToken));
  return response.data;
}

/**
 * Get posts created by a specific user.
 *
 * GET /api/posts?userId=:userId
 * Requires: Bearer access token.
 * Response: { items, page, limit, total, totalPages }
 *
 * @param {string} userId
 * @param {string} accessToken
 * @returns {Promise<{ items: object[], page: number, limit: number, total: number, totalPages: number }>}
 */
export async function getPostsByUser(userId, accessToken) {
  const response = await apiClient.get('/api/posts', {
    ...authHeader(accessToken),
    params: { userId },
  });
  return response.data;
}

/**
 * Get a single post by its ID.
 *
 * GET /api/posts/:id
 * Requires: Bearer access token.
 * Response: post object
 *
 * @param {string} postId
 * @param {string} accessToken
 * @returns {Promise<object>}
 */
export async function getPostById(postId, accessToken) {
  const response = await apiClient.get(`/api/posts/${postId}`, authHeader(accessToken));
  return response.data;
}

/**
 * Create a new post.
 *
 * POST /api/posts
 * Requires: Bearer access token.
 * Body: { title, content, image, tags }
 * Response: confirmed shape unknown — raw data returned as-is.
 *
 * @param {{ title: string, content: string, image: string, tags: string[] }} payload
 * @param {string} accessToken
 * @returns {Promise<object>}
 */
export async function createPost(payload, accessToken) {
  const response = await apiClient.post('/api/posts', payload, authHeader(accessToken));
  return response.data;
}

/**
 * Delete a post by its ID.
 *
 * DELETE /api/posts/:id
 * Requires: Bearer access token.
 *
 * @param {string} postId
 * @param {string} accessToken
 * @returns {Promise<object>}
 */
export async function deletePost(postId, accessToken) {
  const response = await apiClient.delete(`/api/posts/${postId}`, authHeader(accessToken));
  return response.data;
}
