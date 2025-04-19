import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  // Function to handle adding items to cart (used in Suggested Products)
  const addToCart = (itemId) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }));
    console.log(`Added item ${itemId} to cart. Current quantity: ${cart[itemId] ? cart[itemId] + 1 : 1}`);
  };

  // Function to render ratings (from Menu.jsx)
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

  // Fetch featured products, suggested products, and testimonials
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch menu items
        const menuResponse = await axios.get('http://localhost:5001/api/menu');
        const shuffled = [...menuResponse.data].sort(() => 0.5 - Math.random());

        const featured = shuffled.slice(0, 4).map(item => ({
          id: item.item_id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          ratings: item.ratings // Include ratings from MongoDB
        }));

        const suggested = shuffled.slice(4, 8).map(item => ({
          id: item.item_id,
          name: item.name,
          price: item.price,
          image: item.image,
          discount: `${Math.floor(Math.random() * 20) + 5}% off`,
          ratings: item.ratings // Include ratings from MongoDB
        }));

        setFeaturedProducts(featured);
        setSuggestedProducts(suggested);

        // Fetch testimonials
        const testimonialsResponse = await axios.get('http://localhost:5001/api/testimonials');
        setTestimonials(testimonialsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="flex-grow bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="bg-[#F5F5DC] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#4A4A4A] font-[Poppins] animate-fade-in">Welcome to Urban Food 🥗</h1>
          <p className="text-lg md:text-xl mb-6 text-[#6B7280] font-[Poppins]">Fresh ingredients, delivered with a smile!</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/shop')}
              className="bg-[#8BC34A] text-black px-6 py-3 rounded-full font-medium text-lg hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
            >
              View Full Menu
            </button>
            <button className="bg-white text-[#8BC34A] border border-[#8BC34A] px-6 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors duration-300 font-[Poppins]">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] font-[Poppins]">Featured Products</h2>
          <button 
            onClick={() => navigate('/shop')}
            className="text-[#8BC34A] hover:text-[#7CB342] font-medium transition-colors duration-300 font-[Poppins]"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {featuredProducts.map((product) => (
            <div key={product.id} className="w-full max-w-xs bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img 
                src={product.image || 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Product'} 
                alt={product.name} 
                className="w-full h-36 object-cover rounded-md mb-4" 
              />
              <h3 className="text-lg font-semibold text-[#4A4A4A] font-[Poppins] text-center">{product.name}</h3>
              <p className="text-[#6B7280] text-center font-[Poppins]">${product.price}</p>
              <div className="flex justify-center mt-2">
                {renderRating(product.ratings)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Products Section */}
      <section className="container mx-auto px-4 py-12 bg-[#F5F5DC]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] font-[Poppins]">Suggested for You</h2>
          <button 
            onClick={() => navigate('/menu')}
            className="text-[#8BC34A] hover:text-[#7CB342] font-medium transition-colors duration-300 font-[Poppins]"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {suggestedProducts.map((product) => (
            <div key={product.id} className="w-full max-w-xs relative bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img 
                src={product.image || 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Product'} 
                alt={product.name} 
                className="w-full h-36 object-cover rounded-md mb-4" 
              />
              <h3 className="text-lg font-semibold text-[#4A4A4A] font-[Poppins] text-center">{product.name}</h3>
              <p className="text-[#6B7280] text-center font-[Poppins]">${product.price}</p>
              <div className="flex justify-center mt-2">
                {renderRating(product.ratings)}
              </div>
              {product.discount && (
                <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-xs font-semibold px-2 py-1 rounded-full font-[Poppins]">
                  {product.discount}
                </span>
              )}
              <button 
                onClick={() => addToCart(product.id)}
                className="mt-4 w-full bg-[#8BC34A] text-black py-2 rounded-md hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]"
              >
                Add to Cart {cart[product.id] ? `(${cart[product.id]})` : ''}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] font-[Poppins] text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {renderRating(testimonial.rating)}
              </div>
              <p className="text-gray-600 font-[Poppins] mb-4">{testimonial.comment}</p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold text-[#4A4A4A] font-[Poppins]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 font-[Poppins]">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;