import React from 'react';
import { Link } from 'react-router-dom'; // Link import karein

const categories = [
  { name: 'Ring', img: '/images/ivory-romance.png', class: 'card1-outer' },
  { name: 'Earring', img: '/images/earring-img.png', class: 'card2-outer' },
  { name: 'Necklace', img: '/images/hearts.png', class: 'card3-outer' },
  { name: 'Bracelet', img: '/images/bracelet-img.png', class: 'card4-outer' },
  { name: 'Charm', img: '/images/bagcharm.png', class: 'card5-outer' },
];

const Shop = () => (
  <div className="container" id="shop">
    <h1 className="heading">Shop by category</h1>
    <div className="services">
      {categories.map((cat, index) => (
        <div key={index} className={`service-outer ${cat.class}`}>
          <div className="service-title">
            {/* ✅ Link use karein taake page refresh na ho */}
            <Link to={`/products?category=${cat.name}`}>{cat.name}</Link>
          </div>
          <div className="service-card">
            <img src={cat.img} alt={cat.name} />
            <div className="overlay">
              <p>
                <Link to={`/products?category=${cat.name}`}>Pick Your Sparkle</Link>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Shop;