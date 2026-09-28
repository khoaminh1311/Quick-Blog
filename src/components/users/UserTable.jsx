
import RoleBadge from './RoleBadge';
import ChangeRoleButton from './ChangeRoleButton';
import DeleteUserButton from './DeleteUserButton';

export default function UserTable({ users, onChangeRoleSuccess, onDeleteSuccess, onChangeRoleError, onDeleteError }) {
  return (
    <div className="min-h-[420px] rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-wide dark:border-slate-800">
                Username
              </th>
              <th className="border-b border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-wide dark:border-slate-800">
                Email
              </th>
              <th className="border-b border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-wide dark:border-slate-800">
                Role
              </th>
              <th className="border-b border-slate-200 px-4 py-4 text-xs font-bold uppercase tracking-wide dark:border-slate-800 w-36 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="border-b border-slate-100 px-4 py-12 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800 font-semibold">
                    {user.username}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800">
                    {user.email}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 align-top dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-3">
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


