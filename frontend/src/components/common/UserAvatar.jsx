import { FiUser } from 'react-icons/fi';

const getInitials = (name = '', email = '') => {
  const source = name.trim() || email.trim();
  if (!source) return 'U';

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const imageUrl = user?.avatar || user?.profileImage || user?.photo || user?.image;
  const sizeClass = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  }[size];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user?.name || 'User profile'}
        className={`${sizeClass} rounded-full border border-stone-200 object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} inline-flex items-center justify-center rounded-full border border-stone-200 bg-stone-100 font-semibold text-stone-700 ${className}`}
      aria-label={user?.name || 'User'}
    >
      {user?.name || user?.email ? getInitials(user.name, user.email) : <FiUser className="h-4 w-4" />}
    </span>
  );
}
