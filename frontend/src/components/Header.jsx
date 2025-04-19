import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { setUser } = useAuth(); // If using auth context

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
    setError('');
    setSuccess('');
    setIsLoading(false);
    setFormData({
      name: '',
      email: '',
      phone_no: '',
      password: '',
      confirmPassword: ''
    });
  };

  const switchAuthMode = () => {
    setIsLoginForm(!isLoginForm);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      setSuccess(response.data.message);
      console.log('Logged in user:', response.data.user);
      
      // If using auth context:
      // setUser(response.data.user);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setTimeout(() => {
        toggleAuthModal();
        navigate('/profile'); // Redirect after login
      }, 1500);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/users/register', {
        name: formData.name,
        email: formData.email,
        phone_no: formData.phone_no,
        password: formData.password
      });

      setSuccess(response.data.message);
      console.log('Registered user ID:', response.data.user_id);
      
      // Auto-login after registration
      const loginResponse = await axios.post('http://localhost:5001/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      setTimeout(() => {
        toggleAuthModal();
        navigate('/profile'); // Redirect after registration
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <header className="bg-[#F5F5DC] text-[#4A4A4A] shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <svg
              className="w-8 h-8 text-[#8BC34A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h1 className="text-xl font-bold ml-2 font-[Poppins]">Urban Food</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">
            Home
          </Link>
          <Link to="/menu" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">
            Menu
          </Link>
          <Link to="/cart" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">
            Cart
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]">
            About
          </Link>
        </nav>

        {/* Auth and Cart Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleAuthModal}
            className="bg-[#8BC34A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
          >
            {localStorage.getItem('user') ? 'My Account' : 'Login'}
          </button>
          <Link to="/cart" className="relative">
            <svg
              className="w-6 h-6 text-[#4A4A4A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-[#4A4A4A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#EDEDED] py-3 px-4">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/menu" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]" onClick={() => setIsMenuOpen(false)}>
              Menu
            </Link>
            <Link to="/cart" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]" onClick={() => setIsMenuOpen(false)}>
              Cart
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
          </nav>
        </div>
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#4A4A4A] font-[Poppins]">
                  {isLoginForm ? 'Login' : 'Register'}
                </h2>
                <button
                  onClick={toggleAuthModal}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-[Poppins]">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm font-[Poppins]">
                  {success}
                </div>
              )}

              {isLoginForm ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Email
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Password
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword.login ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('login')}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword.login ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9a10.05 10.05 0 01-.125 1.825M12 15a3 3 0 100-6 3 3 0 000 6zm5 5l-3-3m-6 3l3-3" />
                        )}
                      </svg>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`w-full bg-[#8BC34A] text-white py-2 rounded-md font-medium font-[Poppins] hover:bg-[#7CB342] transition-colors duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center text-sm text-gray-600 font-[Poppins]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-[#8BC34A] hover:underline focus:outline-none"
                      onClick={switchAuthMode}
                      disabled={isLoading}
                    >
                      Register
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Full Name
                    </label>
                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Email
                    </label>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Phone Number
                    </label>
                    <input
                      id="register-phone"
                      name="phone_no"
                      type="tel"
                      value={formData.phone_no}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Password
                    </label>
                    <input
                      id="register-password"
                      name="password"
                      type={showPassword.register ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('register')}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword.register ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9a10.05 10.05 0 01-.125 1.825M12 15a3 3 0 100-6 3 3 0 000 6zm5 5l-3-3m-6 3l3-3" />
                        )}
                      </svg>
                    </button>
                  </div>

                  <div className="relative">
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 font-[Poppins] mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('confirm')}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword.confirm ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9a10.05 10.05 0 01-.125 1.825M12 15a3 3 0 100-6 3 3 0 000 6zm5 5l-3-3m-6 3l3-3" />
                        )}
                      </svg>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`w-full bg-[#8BC34A] text-white py-2 rounded-md font-medium font-[Poppins] hover:bg-[#7CB342] transition-colors duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>

                  <div className="text-center text-sm text-gray-600 font-[Poppins]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-[#8BC34A] hover:underline focus:outline-none"
                      onClick={switchAuthMode}
                      disabled={isLoading}
                    >
                      Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;