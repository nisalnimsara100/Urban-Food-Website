// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deals" element={<div className="container mx-auto px-4 py-8"><h2 className="text-2xl font-bold">Deals Page</h2></div>} />
          <Route path="/contact" element={<div className="container mx-auto px-4 py-8"><h2 className="text-2xl font-bold">Contact Page</h2></div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;