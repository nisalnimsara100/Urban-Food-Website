import React from 'react';

// Sample menu data (replace with your own data or API fetch)
const menuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil.',
    price: '$10.99',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a680?auto=format&fit=crop&w=300&h=200',
    rating: 4.0,

  },
  {
    id: 2,
    name: 'Caesar Salad',
    description: 'Fresh romaine, croutons, parmesan, and Caesar dressing.',
    price: '$8.50',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300&h=200',
    rating: 4.0,
  },
  {
    id: 3,
    name: 'Pasta Carbonara',
    description: 'Spaghetti with creamy egg sauce, pancetta, and cheese.',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=300&h=200',
    rating: 4.0,
  },
];

// Menu component
const Menu = () => {
  return (
    <div className="flex flex-wrap gap-5 p-5 max-w-6xl mx-auto">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 min-w-[300px] flex-1"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-left">
            <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
            <p className="my-2 text-gray-600">{item.description}</p>
            <span className="text-lg font-bold text-orange-500">{item.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;