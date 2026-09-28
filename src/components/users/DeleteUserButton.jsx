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
        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => !isDeleting && setIsOpen(false)}
        title="Delete this user?"
        message="This user account will be permanently removed."
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
