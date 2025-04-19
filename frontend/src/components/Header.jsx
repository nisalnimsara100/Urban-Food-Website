import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    setError('');
    setSuccess('');
    const email = e.target['login-email'].value;
    const password = e.target['login-password'].value;

    console.log('Submitting login form with:', { email, password });

    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      setSuccess(response.data.message);
      console.log('Logged in user:', response.data.user);
      setTimeout(togglePopup, 1500);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    setError('');
    setSuccess('');
    const name = e.target['register-name'].value;
    const email = e.target['register-email'].value;
    const phone_no = e.target['register-phone'].value;
    const password = e.target['register-password'].value;
    const confirmPassword = e.target['register-confirm-password'].value;

    console.log('Submitting register form with:', { name, email, phone_no, password, confirmPassword });

    if (password !== confirmPassword) {
      console.log('Password mismatch detected');
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/users/register', {
        name,
        email,
        phone_no,
        password,
      });
      console.log('Register response:', response.data);
      setSuccess(response.data.message);
      console.log('Registered user ID:', response.data.user_id);
      setTimeout(() => {
        switchForm();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-[#F5F5DC] text-[#4A4A4A] shadow-md sticky top-0 z-50 w-full">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-[#8BC34A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Urban Food Logo"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-[#4A4A4A] md:text-2xl font-[Poppins]">
            Urban Food
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
          >
            Menu
          </Link>
          <Link
            to="/categories"
            className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
          >
            Cart
          </Link>
          <Link
            to="/deals"
            className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
          >
            Deals
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
          >
            Contact
          </Link>
        </nav>

        {/* Cart, Login/Register, and Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          <button
            className="bg-[#8BC34A] text-white px-3 py-1 rounded-full font-medium text-sm hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
            onClick={togglePopup}
            aria-label={isLoginForm ? 'Open Login Form' : 'Open Register Form'}
          >
            {isLoginForm ? 'Login' : 'Register'}
          </button>
          <button
            className="bg-[#8BC34A] text-white px-3 py-1 rounded-full font-medium text-sm hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
            aria-label="View Cart"
          >
            Cart (0)
          </button>
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            <svg
              className="w-6 h-6 text-[#4A4A4A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#EDEDED] py-3">
          <nav className="flex flex-col items-center space-y-3">
            <Link
              to="/"
              className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/categories"
              className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart
            </Link>
            <Link
              to="/deals"
              className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-[#8BC34A] transition-colors duration-300 font-[Poppins]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}

      {/* Login/Register Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-[#D1D5DB] bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#FAFAFA] rounded-lg p-6 w-full max-w-md relative shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-[#4A4A4A] hover:text-[#8BC34A] transition-colors duration-300"
              onClick={togglePopup}
              aria-label="Close Popup"
              disabled={isLoading}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Popup Header */}
            <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 font-[Poppins] text-center">
              {isLoginForm ? 'Login' : 'Register'}
            </h2>

            {/* Display Success or Error Messages */}
            {success && <p className="text-green-600 text-center mb-4 font-[Poppins]">{success}</p>}
            {error && <p className="text-red-600 text-center mb-4 font-[Poppins]">{error}</p>}

            {/* Form */}
            {isLoginForm ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-[#4A4A4A] hover:text-[#8BC34A]"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showLoginPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9a10.05 10.05 0 01-.125 1.825M12 15a3 3 0 100-6 3 3 0 000 6zm5 5l-3-3m-6 3l3-3"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-[#8BC34A] text-white py-2 rounded-md font-medium text-sm hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins] ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="register-name">
                    Name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="register-email">
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="register-phone">
                    Phone No
                  </label>
                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="Your Phone No"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="register-password">
                    Password
                  </label>
                  <input
                    id="register-password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-[#4A4A4A] hover:text-[#8BC34A]"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showRegisterPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9a10.05 10.05 0 01-.125 1.825M12 15a3 3 0 100-6 3 3 0 000 6zm5 5l-3-3m-6 3l3-3"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="register-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-[#4A4A4A] hover:text-[#8BC34A]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    disabled={isLoading}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9a10.05 10.05 0 01-.125 1.825M12 15a3 3 0 100-6 3 3 0 000 6zm5 5l-3-3m-6 3l3-3"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-[#8BC34A] text-white py-2 rounded-md font-medium text-sm hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins] ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
            )}

            {/* Switch Form Link */}
            <p className="mt-4 text-sm text-center text-[#6B7280] font-[Poppins]">
              {isLoginForm ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="text-[#8BC34A] hover:underline"
                onClick={switchForm}
                disabled={isLoading}
              >
                {isLoginForm ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;