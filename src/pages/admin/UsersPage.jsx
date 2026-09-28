import { useState, useEffect } from 'react';
import { Puzzle } from 'lucide-react';
import Container from '../../components/common/Container';
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
    <Container className="max-w-6xl pb-12 bg-slate-50/50 dark:bg-slate-900 min-h-screen pt-12">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3">
          <Puzzle className="w-10 h-10 text-emerald-400 fill-emerald-400 rotate-[-15deg]" />
          <h1 className="text-[40px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight">
            User Management
          </h1>
        </div>
      </div>

      <div className="pb-16 bg-slate-50 dark:bg-slate-900 rounded-3xl p-2 sm:p-4">
        {isLoading ? (
          <div className="space-y-4 py-8">
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load users"
            message={error}
            onRetry={handleRetry}
          />
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
    </Container>
  );
}
