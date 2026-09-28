import { useState, useEffect } from 'react';
import ErrorState from '../../components/common/ErrorState';
import UserTable from '../../components/users/UserTable';
import { getUsers } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError } from '../../utils/apiError';
import Skeleton from '../../components/common/Skeleton';

export default function UsersPage() {
  const { accessToken, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers(accessToken);
      setUsers(response.items || []);
    } catch (err) {
      const apiErr = normalizeApiError(err);
      if (apiErr.status === 401) {
        logout();
      } else {
        setError(apiErr.message || 'Failed to load users');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    fetchUsers();
  };

  const handleRoleChangeSuccess = (userId, newRole) => {
    setActionError(null);
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
  };

  const handleDeleteSuccess = (userId) => {
    setActionError(null);
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  const handleActionError = (err) => {
    const apiErr = normalizeApiError(err);
    if (apiErr.status === 401) {
      setActionError("Error: You do not have permission to perform this action. The server returned 401 Unauthorized.");
    } else {
      setActionError(`Error: ${apiErr.message || 'Action failed'}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 min-h-screen pt-12">
      <h1 
        className="mb-10 flex items-center justify-center gap-3 text-[40px] font-bold text-indigo-600"
        style={{ color: 'oklch(0.511 0.262 276.966)', fontSize: '40px' }}
      >
        <span aria-hidden="true">🧩</span> User Management
      </h1>

      {isLoading ? (
        <div className="min-h-[420px] rounded-lg bg-slate-50 p-6 dark:bg-slate-900 space-y-4">
          <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
          <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
          <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
          <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
        </div>
      ) : error ? (
        <div className="min-h-[420px] rounded-lg bg-slate-50 p-6 dark:bg-slate-900 flex items-center justify-center">
          <ErrorState
            title="Failed to load users"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      ) : (
        <>
          {actionError && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
              {actionError}
            </div>
          )}
          <UserTable 
            users={users} 
            onChangeRoleSuccess={handleRoleChangeSuccess}
            onDeleteSuccess={handleDeleteSuccess}
            onChangeRoleError={handleActionError}
            onDeleteError={handleActionError}
          />
        </>
      )}
    </div>
  );
}
