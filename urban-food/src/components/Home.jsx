import React, { useState, useEffect } from 'react';

const suggestedProducts = [
  { id: 5, name: 'Almond Milk', price: 3.99, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Milk', discount: '10% off' },
  { id: 6, name: 'Organic Bananas', price: 2.49, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Bananas', discount: '15% off' },
  { id: 7, name: 'Greek Yogurt', price: 4.29, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Yogurt', discount: '20% off' },
  { id: 8, name: 'Honey', price: 5.99, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Honey', discount: '5% off' },
];

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/menu');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Limit to 4 items and map to match Home.jsx structure
        const mappedData = data.slice(0, 4).map(item => ({
          id: item.ITEM_ID,
          name: item.NAME,
          price: item.PRICE,
          image: item.IMAGE,
        }));
        setFeaturedProducts(mappedData);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        // Fallback to static data if fetch fails
        setFeaturedProducts([
          { id: 1, name: 'Organic Apples', price: 4.99, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Apples' },
          { id: 2, name: 'Fresh Bread', price: 2.99, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Bread' },
          { id: 3, name: 'Avocado', price: 1.99, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Avocado' },
          { id: 4, name: 'Orange Juice', price: 3.49, image: 'https://via.placeholder.com/150/D1D5DB/FFFFFF?text=Juice' },
        ]);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <main className="flex-grow bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="bg-[#F5F5DC] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#4A4A4A] font-[Poppins] animate-fade-in">Welcome to Urban Food 🥗</h1>
          <p className="text-lg md:text-xl mb-6 text-[#6B7280] font-[Poppins]">Fresh ingredients, delivered with a smile!</p>
          <button className="bg-[#8BC34A] text-black px-6 py-3 rounded-full font-medium text-lg hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]">
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#4A4A4A] font-[Poppins]">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {featuredProducts.map((product) => (
            <div key={product.id} className="w-full max-w-xs bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold text-[#4A4A4A] font-[Poppins] text-center">{product.name}</h3>
              <p className="text-[#6B7280] text-center font-[Poppins]">${product.price.toFixed(2)}</p>
              <button className="mt-4 w-full bg-[#8BC34A] text-black py-2 rounded-md hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Products Section */}
      <section className="container mx-auto px-4 py-12 bg-[#F5F5DC]">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#4A4A4A] font-[Poppins]">Suggested for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {suggestedProducts.map((product) => (
            <div key={product.id} className="w-full max-w-xs relative bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold text-[#4A4A4A] font-[Poppins] text-center">{product.name}</h3>
              <p className="text-[#6B7280] text-center font-[Poppins]">${product.price.toFixed(2)}</p>
              <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-xs font-semibold px-2 py-1 rounded-full font-[Poppins]">
                {product.discount}
              </span>
              <button className="mt-4 w-full bg-[#8BC34A] text-black py-2 rounded-md hover:bg-[#7CB342] transition-colors duration-300 font-[Poppins]">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;