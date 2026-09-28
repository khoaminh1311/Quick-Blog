import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { deletePost } from '../../services/postService';
import { canDeletePost } from '../../utils/permissions';
import { normalizeApiError } from '../../utils/apiError';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * Reusable button for deleting a post.
 * Includes permission checks, confirm dialog, API call, and error handling.
 * 
 * @param {object} post - The post to delete.
 * @param {function} onSuccess - Callback when deletion is successful.
 * @param {string} [variant] - 'icon' for default floating round button, 'solid' for solid square button.
 * @param {string} [className] - Optional CSS classes for the button.
 */
export default function DeletePostButton({ post, onSuccess, variant = 'icon', className = '' }) {
  const { user: currentUser, accessToken, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!canDeletePost(currentUser, post)) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deletePost(post._id, accessToken);
      setIsOpen(false);
      onSuccess();
    } catch (err) {
      const apiErr = normalizeApiError(err);
      if (apiErr.status === 401) {
        setIsOpen(false);
        logout();
      } else {
        // 403 or network error
        setError(apiErr.message || 'Failed to delete post. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
          setError(null);
        }}
        className={
          variant === 'solid'
            ? `flex items-center justify-center w-10 h-10 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${className}`
            : `flex items-center justify-center p-2 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800/90 dark:hover:bg-red-500/20 dark:hover:text-red-400 ${className}`
        }
        title="Delete Post"
        aria-label="Delete Post"
      >
        <Trash2 className={variant === 'solid' ? 'w-5 h-5' : 'w-4 h-4'} />
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => !isDeleting && setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message={
          <>
            Are you sure you want to delete <strong>"{post.title}"</strong>? 
            This action cannot be undone.
            {error && (
              <span className="block mt-4 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </span>
            )}
          </>
        }
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </>
  );
}
