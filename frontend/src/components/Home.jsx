import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  // Function to handle adding items to cart
  const addToCart = (itemId) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }));
    console.log(`Added item ${itemId} to cart. Current quantity: ${cart[itemId] ? cart[itemId] + 1 : 1}`);
  };

  // Fetch featured and suggested products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/menu');
        
        // Get 8 random items (4 for featured, 4 for suggested)
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        
        const featured = shuffled.slice(0, 4).map(item => ({
          id: item.item_id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description
        }));
        
        const suggested = shuffled.slice(4, 8).map(item => ({
          id: item.item_id,
          name: item.name,
          price: item.price,
          image: item.image,
          discount: `${Math.floor(Math.random() * 20) + 5}% off`
        }));

        setFeaturedProducts(featured);
        setSuggestedProducts(suggested);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="flex-grow bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading products...</p>
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
    </main>
  );
}

export default Home;