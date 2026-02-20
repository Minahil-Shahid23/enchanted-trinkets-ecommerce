import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Navbar = ({ cartCount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    // Agar user 'Enter' dabaye toh search chale
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      navigate(`/products?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Enchanted Trinkets
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><HashLink smooth to="/#about">About Me</HashLink></li>
        <li><HashLink smooth to="/#shop">Shop</HashLink></li>
        <li><Link to="/cart">Cart</Link></li>
      </ul>

      <div className="search">
        <div className="search-box">
          <input
            type="text"
            className="search-prod"
            placeholder="🔍︎ Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <Link to="/cart" className="cart-icon-wrapper">
          <div className="cart-icon">
            🛒
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;