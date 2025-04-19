import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({}); // Track cart items and quantities

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items from /api/menu...');
        const response = await axios.get('http://localhost:5001/api/menu');
        console.log('Menu items fetched successfully:', response.data);
        setMenuItems(response.data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
      }
    };

    fetchMenuItems();
  }, []);

  // Function to handle adding items to cart
  const addToCart = (itemId) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }));
    // Optional: Add a visual feedback or toast notification
    console.log(`Added item ${itemId} to cart. Current quantity: ${cart[itemId] ? cart[itemId] + 1 : 1}`);
  };

  // Function to render rating with a single star icon
  const renderRating = (rating) => {
    const ratingOutOf10 = rating * 2; // Convert rating from 5-point to 10-point scale
    return (
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-yellow-500 mr-1"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span className="text-gray-600 text-sm">{ratingOutOf10.toFixed(1)}</span>
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
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
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
              Add to Cart {cart[item.item_id] ? `(${cart[item.item_id]})` : ''}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Menu;