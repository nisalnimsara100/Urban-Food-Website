// Menu.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to load user from localStorage
  const loadUserFromStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Menu.jsx: loadUserFromStorage called, storedUser:', storedUser);
    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      setCurrentUser(null);
    }
  };

  // Load user on mount and when location changes
  useEffect(() => {
    console.log('Menu.jsx: useEffect for loading user triggered');
    loadUserFromStorage();
  }, [location]);

  // Listen for storage and userUpdated events
  useEffect(() => {
    console.log('Menu.jsx: Setting up event listeners for storage and userUpdated');
    const handleStorageChange = (event) => {
      console.log('Menu.jsx: Storage event triggered:', event);
      if (event.key === 'user') {
        loadUserFromStorage();
      }
    };

    const handleCustomStorageChange = () => {
      console.log('Menu.jsx: userUpdated event triggered');
      loadUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleCustomStorageChange);

    return () => {
      console.log('Menu.jsx: Cleaning up event listeners');
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleCustomStorageChange);
    };
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Menu.jsx: Fetching menu items from /api/menu...');
        const response = await axios.get('http://localhost:5001/api/menu', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Menu.jsx: Menu items fetched successfully:', response.data);
        setMenuItems(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Menu.jsx: Error fetching menu items:', err);
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(`Failed to load menu items: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          // Request was made but no response received
          setError('Failed to load menu items: No response from server. Please check if the backend is running.');
        } else {
          // Something else caused the error
          setError(`Failed to load menu items: ${err.message}`);
        }
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = async (itemId) => {
    console.log('Menu.jsx: addToCart called, currentUser:', currentUser);

    // Double-check localStorage in case currentUser hasn't been updated yet
    if (!currentUser) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Menu.jsx: currentUser is null, checking localStorage again:', storedUser);
      if (storedUser) {
        setCurrentUser(storedUser);
      } else {
        console.log('Menu.jsx: No currentUser found when trying to add to cart');
        setError('Please log in to add items to your cart.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
    }

    // Now that we've ensured currentUser is set, proceed
    if (!currentUser.user_id) {
      console.error('Menu.jsx: currentUser does not have a user_id:', currentUser);
      setError('User authentication error. Please log in again.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    try {
      // Step 1: Fetch or create the user's cart
      let cartId;
      const cartResponse = await axios.get(`http://localhost:5001/api/cart/user/${currentUser.user_id}`);
      console.log('Menu.jsx: Cart response:', cartResponse.data);

      if (cartResponse.data.cart) {
        cartId = cartResponse.data.cart.CART_ID;
        console.log('Menu.jsx: Existing cart found, cart_id:', cartId);
      } else {
        console.log('Menu.jsx: No cart found, creating a new cart for user_id:', currentUser.user_id);
        const createCartResponse = await axios.post('http://localhost:5001/api/cart', {
          user_id: currentUser.user_id,
        });
        cartId = createCartResponse.data.cart_id;
        console.log('Menu.jsx: New cart created, cart_id:', cartId);
      }

      // Step 2: Add or update the item in the cart
      console.log('Menu.jsx: Adding item to cart_items, cart_id:', cartId, 'item_id:', itemId);
      const addItemResponse = await axios.post('http://localhost:5001/api/cart/add-item', {
        cart_id: cartId,
        item_id: itemId,
        quantity: 1,
      });
      console.log('Menu.jsx: Item added to cart_items successfully:', addItemResponse.data);

      // Step 3: Dispatch cartUpdated event to notify Header
      window.dispatchEvent(new Event('cartUpdated'));
      console.log('Menu.jsx: cartUpdated event dispatched');
    } catch (err) {
      console.error('Menu.jsx: Error adding item to cart:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to add item to cart. Please try again.');
    }
  };

  const renderRating = (rating) => {
    const ratingOutOf10 = rating * 2;
    return (
      <div className="flex items-center">
        {rating > 0 ? (
          <>
            <svg
              className="w-5 h-5 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-gray-600 text-sm">{ratingOutOf10.toFixed(1)}</span>
          </>
        ) : (
          <span className="text-gray-600 text-sm">No ratings yet</span>
        )}
      </div>
    );
  };

  if (error) {
    return <div className="text-red-600 text-center p-5">{error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-5 p-5 max-w-6xl mx-auto">
      {menuItems.length === 0 ? (
        <div className="text-gray-600 text-center w-full">Loading menu items...</div>
      ) : (
        menuItems.map((item) => (
          <div
            key={item.item_id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 min-w-[300px] flex-1 flex flex-col"
          >
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-left flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="my-2 text-gray-600">{item.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-orange-500">${item.price}</span>
                {renderRating(item.ratings)}
              </div>
            </div>
            <button
              onClick={() => addToCart(item.item_id)}
              className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold py-2 px-4 rounded-b-lg transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Menu;