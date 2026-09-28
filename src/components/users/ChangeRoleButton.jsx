import { useState } from 'react';
import PropTypes from 'prop-types';
import { KeyRound, User as UserIcon, Shield, Check, ChevronDown, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { updateUserRole } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

export default function ChangeRoleButton({ user, onSuccess, onError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { accessToken } = useAuth();

  const handleOpen = () => {
    setSelectedRole(user.role);
    setIsOpen(true);
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    if (isChanging) return;
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (selectedRole === user.role) {
      setIsOpen(false);
      return;
    }
    setIsChanging(true);
    try {
      await updateUserRole(user._id, selectedRole, accessToken);
      setIsOpen(false);
      if (onSuccess) onSuccess(user._id, selectedRole);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 h-9 w-11 rounded-[10px] bg-indigo-50 text-indigo-600 shadow-none hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
        aria-label={`Change role for ${user.username}`}
        title={`Change role for ${user.username}`}
      >
        <KeyRound className="h-5 w-5 stroke-[2.5]" />
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title="Change User Role"
        description={`Select the new role for ${user.username}.`}
      >
        <label className="mt-5 block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Select Role
        </label>
        
        <div className="relative mt-2">
          <button
            type="button"
            role="combobox"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span style={{ pointerEvents: 'none' }}>
              <span className="inline-flex items-center gap-2">
                {selectedRole === 'admin' ? (
                  <Shield className="lucide-shield h-4 w-4" />
                ) : (
                  <UserIcon className="lucide-user h-4 w-4" />
                )}
                <span className="capitalize">{selectedRole}</span>
              </span>
            </span>
            <span aria-hidden="true">
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => { setSelectedRole('user'); setIsDropdownOpen(false); }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  selectedRole === 'user' 
                    ? 'bg-slate-100 dark:bg-slate-800 font-semibold' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>User</span>
                </span>
                {selectedRole === 'user' && <Check className="h-4 w-4 text-slate-700 dark:text-slate-200" />}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('admin'); setIsDropdownOpen(false); }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  selectedRole === 'admin' 
                    ? 'bg-slate-100 dark:bg-slate-800 font-semibold' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </span>
                {selectedRole === 'admin' && <Check className="h-4 w-4 text-slate-700 dark:text-slate-200" />}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isChanging}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 h-10 px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isChanging}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 h-10 px-4"
          >
            {isChanging ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Role'}
          </button>
        </div>
      </Modal>
    </>
  );
}

ChangeRoleButton.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
