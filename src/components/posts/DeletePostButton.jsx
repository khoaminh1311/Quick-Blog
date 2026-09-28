import { useState } from 'react';
import { Trash2, MoreHorizontal } from 'lucide-react';
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
 * @param {string} [variant] - 'icon' for default floating round button, 'solid' for solid square button, 'ellipsis' for card actions.
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
            : variant === 'ellipsis'
            ? `absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/55 text-blue-500/70 opacity-0 shadow-sm shadow-slate-900/10 backdrop-blur-md transition duration-200 hover:bg-white/75 hover:text-blue-600/85 hover:opacity-95 group-hover/actions:translate-y-11 group-hover/actions:opacity-80 group-focus-within/actions:translate-y-11 group-focus-within/actions:opacity-80 ${className}`
            : `flex items-center justify-center p-2 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800/90 dark:hover:bg-red-500/20 dark:hover:text-red-400 ${className}`
        }
        title={variant === 'ellipsis' ? `Open actions for ${post.title}` : "Delete Post"}
        aria-label={variant === 'ellipsis' ? `Open actions for ${post.title}` : "Delete Post"}
      >
        {variant === 'solid' ? (
          <Trash2 className="w-5 h-5" />
        ) : variant === 'ellipsis' ? (
          <MoreHorizontal className="h-6 w-6 stroke-[1.9]" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
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
