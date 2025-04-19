import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm mb-6 hover:shadow-md transition-all duration-300 border border-[#F5F5DC]">
      {/* Left Section: Image and Item Details */}
      <div className="flex items-center space-x-6 w-full">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#4A4A4A] tracking-tight font-[Poppins]">{item.name}</h3>
          <p className="text-[#6B7280] text-sm mt-1 line-clamp-2 font-[Poppins]">{item.description}</p>
          <div className="flex items-center space-x-3 mt-2">
            <p className="text-lg font-medium text-[#8BC34A] font-[Poppins]">
              ${item.price.toFixed(2)} <span className="text-[#D1D5DB] text-sm">/ unit</span>
            </p>
            <p className="text-[#6B7280] text-sm font-[Poppins]">In stock: {item.stock_qty}</p>
          </div>
        </div>
      </div>

      {/* Right Section: Quantity Controls and Remove Button */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm border-[#D1D5DB]">
          <button
            onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity - 1)}
            className="px-4 py-2 bg-[#F5F5DC] hover:bg-[#EDEDED] text-[#4A4A4A] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-[Poppins]"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="px-6 py-2 bg-white text-[#4A4A4A] font-medium font-[Poppins]">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity + 1)}
            className="px-4 py-2 bg-[#F5F5DC] hover:bg-[#EDEDED] text-[#4A4A4A] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-[Poppins]"
            disabled={item.quantity >= item.stock_qty}
          >
            +
          </button>
        </div>
        <button
          onClick={() => onRemove(item.cart_item_id, item.cart_id, item.item_id)}
          className="text-[#EF4444] hover:text-[#DC2626] font-medium flex items-center space-x-1 transition-colors duration-200 font-[Poppins]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Function to load user from localStorage
  const loadUserFromStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      setCurrentUser(null);
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Listen for changes to localStorage (e.g., login/logout from Header)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        loadUserFromStorage();
      }
    };

    const handleCustomStorageChange = () => {
      loadUserFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleCustomStorageChange);
    };
  }, []);

  // Listen for cartUpdated events to refresh cart items
  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartItems();
    };

    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [currentUser]);

  const fetchCartItems = async () => {
    if (!currentUser) {
      setError('Please log in to view your cart.');
      setLoading(false);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      // Step 1: Get the user's cart
      const cartResponse = await axios.get(`http://localhost:5001/api/cart/user/${currentUser.user_id}`);
      if (!cartResponse.data.cart) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const cartId = cartResponse.data.cart.cart_id;

      // Step 2: Fetch cart items
      const response = await axios.get(`http://localhost:5001/api/cart/${cartId}`);
      setCartItems(response.data);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load cart items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [currentUser, navigate]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the item
      const item = cartItems.find((i) => i.cart_item_id === cartItemId);
      if (item) {
        await removeItem(cartItemId, item.cart_id, item.item_id);
      }
      return;
    }

    const item = cartItems.find((i) => i.cart_item_id === cartItemId);
    if (!item) return;

    try {
      await axios.put('http://localhost:5001/api/cart/update-item', {
        cart_id: item.cart_id,
        item_id: item.item_id,
        quantity: newQuantity,
      });

      setCartItems(cartItems.map((i) =>
        i.cart_item_id === cartItemId ? { ...i, quantity: Math.min(newQuantity, i.stock_qty) } : i
      ));

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (cartItemId, cartId, itemId) => {
    try {
      await axios.delete(`http://localhost:5001/api/cart/remove-item/${cartId}/${itemId}`);

      setCartItems(cartItems.filter((i) => i.cart_item_id !== cartItemId));

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (error) {
    return <div className="text-red-600 text-center p-5">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#FAFAFA] min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center text-[#4A4A4A] tracking-tight font-[Poppins]">
        Your Shopping Cart
      </h1>
      {loading ? (
        <div className="text-gray-600 text-center py-16">Loading cart items...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#F5F5DC]">
          <svg
            className="w-16 h-16 mx-auto text-[#D1D5DB] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-[#6B7280] text-lg mb-6 font-[Poppins]">Your cart is empty.</p>
          <Link
            to="/menu"
            className="inline-block bg-[#8BC34A] text-white py-3 px-8 rounded-lg hover:bg-[#7CB342] transition-colors duration-200 text-sm font-semibold font-[Poppins]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.cart_item_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm flex justify-between items-center border border-[#F5F5DC]">
            <h2 className="text-2xl font-semibold text-[#4A4A4A] font-[Poppins]">Total:</h2>
            <p className="text-2xl font-bold text-[#8BC34A] font-[Poppins]">${totalPrice.toFixed(2)}</p>
          </div>
          <button className="mt-8 w-full bg-[#8BC34A] text-white py-4 rounded-lg text-lg font-semibold hover:bg-[#7CB342] transition-all duration-300 shadow-sm font-[Poppins]">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;