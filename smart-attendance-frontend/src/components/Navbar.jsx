import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Generate avatar from name initials
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate avatar URL from name
const getAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=40&bold=true`;
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayPhoto = user?.profilePhoto || (user?.name ? getAvatarUrl(user.name) : '');

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-slate-900">
          Smart Attendance
        </span>
        {user && (
          <div className="flex items-center gap-3">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={user.name}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                onError={(e) => {
                  e.target.src = user?.name ? getAvatarUrl(user.name) : '';
                }}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
                {getInitials(user.name)}
              </div>
            )}
            <span className="text-xs text-slate-500">{user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}


