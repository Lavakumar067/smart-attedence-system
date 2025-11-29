import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI } from '../utils/api.js';

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

// Generate avatar URL from name (using UI Avatars service)
const getAvatarUrl = (name) => {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128&bold=true`;
};

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePhotoChange = async (e) => {
    const url = e.target.value;
    setProfilePhoto(url);
  };

  const handleSavePhoto = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const response = await authAPI.updateProfile({ profilePhoto });
      const updatedUser = response.data;
      
      // Update context and local storage
      updateUser(updatedUser);
      setMessage('Profile photo updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile photo');
    } finally {
      setLoading(false);
    }
  };

  const displayPhoto = profilePhoto || (user?.name ? getAvatarUrl(user.name) : '');

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="mb-4 text-sm text-slate-500">
        Manage your profile and basic preferences.
      </p>
      <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
        {/* Profile Photo Section */}
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={user?.name || 'Profile'}
                className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
                onError={(e) => {
                  // Fallback to avatar if image fails to load
                  e.target.src = user?.name ? getAvatarUrl(user.name) : '';
                }}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-600">
                {getInitials(user?.name)}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="mb-1 text-sm font-medium text-slate-700">Name</p>
              <p className="text-base text-slate-900">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-700">Email</p>
              <p className="text-base text-slate-900">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-700">Role</p>
              <p className="text-base text-slate-900 capitalize">
                {user?.role || 'teacher'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Photo URL Input */}
        <div className="border-t pt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Profile Photo URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={profilePhoto}
              onChange={handlePhotoChange}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
            />
            <button
              onClick={handleSavePhoto}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Enter a URL to an image. If left empty, an avatar will be generated from your name.
          </p>
          {message && (
            <p className={`mt-2 text-xs ${message.includes('Failed') ? 'text-red-600' : 'text-emerald-600'}`}>
              {message}
            </p>
          )}
        </div>

        {/* Logout Button */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={logout}
            className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


