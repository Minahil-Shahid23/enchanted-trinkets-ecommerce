import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <div className="logo">Enchanted Trinkets</div>

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
