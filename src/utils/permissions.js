/**
 * Centralized permissions logic for the application.
 */

/**
 * Checks if the current user has permission to delete a specific post.
 * 
 * Rules:
 * - Admin can delete any post.
 * - Regular user can only delete their own posts.
 * - If user or post is missing, returns false.
 * 
 * @param {object|null} currentUser - The current authenticated user from AuthContext.
 * @param {object|null} post - The post object to be evaluated.
 * @returns {boolean} True if permitted, false otherwise.
 */
export function canDeletePost(currentUser, post) {
  if (!currentUser || !post || !post.author) {
    return false;
  }

  if (currentUser.role === 'admin') {
    return true;
  }

  // The backend might return author as a string ID (Create) or an object (Get)
  const authorId = typeof post.author === 'string' ? post.author : post.author._id;

  return currentUser.id === authorId;
}
