import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError('Failed to log out');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const displayName = formData.get('displayName') as string;

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateUserProfile(displayName);
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-domine font-bold mb-6">Profile</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Account Information</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Name: {user?.name || 'Not set'}</p>
        </div>

        <form onSubmit={handleProfileUpdate} className="mb-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
