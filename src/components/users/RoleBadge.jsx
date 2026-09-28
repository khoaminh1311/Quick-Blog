import PropTypes from 'prop-types';

export default function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
        isAdmin
          ? 'bg-amber-100/70 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-indigo-100/70 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
      }`}
    >
      {role}
    </span>
  );
}

RoleBadge.propTypes = {
  role: PropTypes.string.isRequired,
};
