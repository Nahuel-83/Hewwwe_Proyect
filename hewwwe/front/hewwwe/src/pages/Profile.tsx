import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiLogOut } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { getProfile, updateProfile } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: null as File | null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setFormData({
          username: response.data.username,
          email: response.data.email,
          avatar: null,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      const response = await updateProfile(data);
      dispatch({ type: 'SET_USER', payload: response.data });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        avatar: e.target.files![0],
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-domine font-bold text-gray-900">
              My Profile
            </h1>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    formData.avatar
                      ? URL.createObjectURL(formData.avatar)
                      : state.user?.avatar || 'https://via.placeholder.com/100'
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="btn-secondary cursor-pointer"
                  >
                    Change Photo
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="input-field mt-1"
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={state.user?.avatar || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-medium text-gray-900">
                    {state.user?.username}
                  </h2>
                  <p className="text-gray-500">{state.user?.email}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <FiEdit2 />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="border-t">
          <div className="grid grid-cols-3 divide-x">
            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Items Sold</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Active Listings</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {state.user?.rating.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
