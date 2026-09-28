import { useState } from 'react';
import PropTypes from 'prop-types';
import { Key, Loader2, User as UserIcon, Shield, Check, ChevronDown } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
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
        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 dark:focus:ring-offset-slate-900"
        title="Change Role"
      >
        <Key className="w-4 h-4" />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Change User Role">
        <div className="space-y-6 pb-2">
          <p className="text-slate-600 dark:text-slate-300">
            Select the new role for {user.username}.
          </p>

          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Select Role
            </label>
            
            {!isDropdownOpen ? (
              <button
                type="button"
                onClick={() => setIsDropdownOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                  {selectedRole === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  <span className="capitalize">{selectedRole}</span>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </button>
            ) : (
              <div className="w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setSelectedRole('user'); setIsDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                    selectedRole === 'user' 
                      ? 'bg-slate-50 dark:bg-slate-700/50' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <UserIcon className="w-5 h-5" />
                    <span>User</span>
                  </div>
                  {selectedRole === 'user' && <Check className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('admin'); setIsDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                    selectedRole === 'admin' 
                      ? 'bg-slate-50 dark:bg-slate-700/50' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <Shield className="w-5 h-5" />
                    <span>Admin</span>
                  </div>
                  {selectedRole === 'admin' && <Check className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={handleClose} 
              disabled={isChanging}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              isLoading={isChanging}
            >
              Save Role
            </Button>
          </div>
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
