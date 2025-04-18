import React, { useState } from 'react';
import './Cart.css'; // Optional: For custom CSS if not using Tailwind

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
        >
          +
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Wireless Headphones', price: 59.99, quantity: 1, image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Smartphone Case', price: 19.99, quantity: 2, image: 'https://via.placeholder.com/100' },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
          <div className="mt-6 p-4 bg-white rounded-lg shadow flex justify-between">
            <h2 className="text-xl font-semibold">Total:</h2>
            <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>
          <button className="mt-4 w-full bg-[#8BC34A] text-white py-2 rounded-lg hover:bg-[#7f9e59]">
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;