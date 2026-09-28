import PropTypes from 'prop-types';
import RoleBadge from './RoleBadge';
import ChangeRoleButton from './ChangeRoleButton';
import DeleteUserButton from './DeleteUserButton';
import { useAuth } from '../../hooks/useAuth';

export default function UserTable({ users, onChangeRoleSuccess, onDeleteSuccess, onChangeRoleError, onDeleteError }) {
  const { user: currentUser } = useAuth();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto p-4 sm:p-6 pt-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/50 text-[11px] uppercase tracking-widest text-slate-900 dark:text-slate-400 font-bold">
              <th className="py-4 pr-4">USERNAME</th>
              <th className="py-4 px-4">EMAIL</th>
              <th className="py-4 px-4 text-center">ROLE</th>
              <th className="py-4 pl-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/20">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-500 dark:text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => {
                const isSelf = currentUser?.id === user._id;

                return (
                  <tr key={user._id} className="group transition-colors text-sm">
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {user.username}
                        {isSelf && (
                          <span className="text-[10px] uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {user.email}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="py-4 pl-4">
                      <div className="flex items-center justify-center gap-2">
                        {!isSelf ? (
                          <>
                            <DeleteUserButton 
                              user={user} 
                              onSuccess={onDeleteSuccess}
                              onError={onDeleteError}
                            />
                            <ChangeRoleButton 
                              user={user} 
                              onSuccess={onChangeRoleSuccess}
                              onError={onChangeRoleError}
                            />
                          </>
                        ) : (
                          <span className="text-xs text-slate-300 dark:text-slate-600 italic px-2">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChangeRoleSuccess: PropTypes.func,
  onDeleteSuccess: PropTypes.func,
  onChangeRoleError: PropTypes.func,
  onDeleteError: PropTypes.func,
};
