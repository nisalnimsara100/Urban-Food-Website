import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone_no: ''
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('No user session found. Please log in.');
        }

        const user = JSON.parse(storedUser);
        if (!user || !user.user_id) {
          throw new Error('Invalid user data in session. Please log in again.');
        }

        const userResponse = await axios.get(`http://localhost:5001/api/users/${user.user_id}`);
        if (!userResponse.data.user) {
          throw new Error('User profile not found. Your account may have been deleted.');
        }
        setUserData(userResponse.data.user);

        // Fetch cart data
        const cartResponse = await axios.get(`http://localhost:5001/api/cart/${user.user_id}`);
        setCartData(cartResponse.data);

        setEditFormData({
          name: userResponse.data.user.name || '',
          email: userResponse.data.user.email || '',
          phone_no: userResponse.data.user.phone_no || ''
        });
      } catch (err) {
        console.error('Profile error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
        if (
          err.message.includes('session') ||
          err.message.includes('User profile not found') ||
          err.response?.status === 401 ||
          err.response?.status === 404
        ) {
          localStorage.removeItem('user');
          navigate('/?error=session_expired');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(`http://localhost:5001/api/users/${storedUser.user_id}`, {
        name: editFormData.name,
        email: editFormData.email,
        phone_no: editFormData.phone_no
      });

      const updatedUser = response.data.user;
      setUserData(updatedUser);

      const updatedStoredUser = { ...storedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(updatedStoredUser));

      setEditSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      setEditError(err.response?.data?.error || err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin w-10 h-10 text-orange-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-[Poppins]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-red-600 font-[Poppins] mb-4">Profile Error</h2>
          <p className="text-gray-600 font-[Poppins] mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block bg-orange-500 text-white py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors duration-300 text-sm font-semibold font-[Poppins]"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 tracking-tight font-[Poppins]">
        Your Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-[Poppins]">Edit Profile</h2>

            {editError && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm font-[Poppins]">
                {editError}
              </div>
            )}
            {editSuccess && (
              <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm font-[Poppins]">
                {editSuccess}
              </div>
            )}

            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-2">
                Full Name
              </label>
              <input
                id="edit-name"
                name="name"
                type="text"
                value={editFormData.name}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-[Poppins] text-gray-800"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-2">
                Email
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-[Poppins] text-gray-800"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-2">
                Phone Number
              </label>
              <input
                id="edit-phone"
                name="phone_no"
                type="tel"
                value={editFormData.phone_no}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-[Poppins] text-gray-800"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 font-[Poppins]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 font-[Poppins]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 font-[Poppins]">Profile Details</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 font-[Poppins] flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[Poppins]">Full Name</p>
                  <p className="text-lg text-gray-800 font-[Poppins]">{userData.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[Poppins]">Email</p>
                  <p className="text-lg text-gray-800 font-[Poppins]">{userData.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[Poppins]">Phone Number</p>
                  <p className="text-lg text-gray-800 font-[Poppins]">{userData.phone_no || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[Poppins]">Member Since</p>
                  <p className="text-lg text-gray-800 font-[Poppins]">
                    {new Date(userData.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 font-[Poppins]">Your Cart</h2>
          <Link
            to="/cart"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 font-[Poppins] flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>View Cart</span>
          </Link>
        </div>
        {cartData && cartData.length > 0 ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-800 font-[Poppins]">
              You have <span className="font-semibold text-orange-500">{cartData.length}</span> items in your cart.
            </p>
            <p className="text-sm text-gray-600 font-[Poppins]">
              Cart ID: <span className="font-medium">{cartData[0].cart_id}</span>
            </p>
            <p className="text-sm text-gray-600 font-[Poppins]">
              Total Items Quantity: <span className="font-medium">{cartData.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </p>
            <p className="text-sm text-gray-600 font-[Poppins]">
              Total Price: <span className="font-medium text-orange-500">${cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-600 font-[Poppins]">Your cart is empty. Start shopping now!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;