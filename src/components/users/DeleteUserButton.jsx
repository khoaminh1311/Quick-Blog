import { useState } from 'react';
import PropTypes from 'prop-types';
import { Trash2, Loader2 } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import { deleteUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

export default function DeleteUserButton({ user, onSuccess, onError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { accessToken } = useAuth();

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(user._id, accessToken);
      setIsOpen(false);
      if (onSuccess) onSuccess(user._id);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 h-9 w-11 rounded-[10px] bg-red-500 text-white shadow-none hover:bg-red-600"
        aria-label={`Delete ${user.username}`}
        title={`Delete ${user.username}`}
      >
        <Trash2 className="lucide-trash-2 h-5 w-5 stroke-[2.5]" />
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => !isDeleting && setIsOpen(false)}
        title="Delete this user?"
        message="This user account and all their posts will be permanently removed."
        confirmText={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleConfirm}
        isDestructive={true}
      />
    </>
  );
}

DeleteUserButton.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
