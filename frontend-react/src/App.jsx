import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';


/* ---------- Scroll To Top ---------- */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


/* ---------- App ---------- */
function App() {

  const calculateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return savedCart.reduce((acc, item) => acc + (item.qty || 1), 0);
  };

  const [cartCount, setCartCount] = useState(calculateCartCount);

  const updateCartCount = () => {
    setCartCount(calculateCartCount());
  };

  const addToCart = () => {
    updateCartCount();
  };


  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home cartCount={cartCount} />} />

        <Route path="/products" element={<Products cartCount={cartCount} />} />
        <Route path="/shop" element={<Products cartCount={cartCount} />} />

        <Route
          path="/product/:id"
          element={<ProductDetail addToCart={addToCart} cartCount={cartCount} />}
        />

        <Route
          path="/cart"
          element={<Cart cartCount={cartCount} updateCartCount={updateCartCount} />}
        />

        <Route path="/checkout" element={<Checkout cartCount={cartCount} />} />

        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
