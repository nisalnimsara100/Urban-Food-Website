import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  // Placeholder for form submission (to be implemented based on your backend)
  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic (e.g., API call) here
    console.log('Login submitted');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add registration logic (e.g., API call) here
    console.log('Register submitted');
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#8BC34A] text-white py-2 rounded-md font-medium text-sm hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
                >
                  Login
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] font-[Poppins]" htmlFor="register-password">
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Your password"
                    className="w-full px-3 py-2 rounded-md border border-[#D1D5DB] text-[#4A4A4A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] font-[Poppins]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#8BC34A] text-white py-2 rounded-md font-medium text-sm hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
                >
                  Register
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