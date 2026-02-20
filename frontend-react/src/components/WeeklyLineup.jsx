import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = 'https://enchanted-backend.vercel.app';
const WeeklyLineup = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyProducts = async () => {
      try {
const res = await axios.get(`${BASE_URL}/api/weekly-products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching weekly products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyProducts();
  }, []);

  if (loading)
    return <p style={{ textAlign: 'center' }}>Loading Weekly Lineup...</p>;

  return (
    <div className="weekly-products" id="weekly-products-container">
      {products.length > 0 ? (
        products.map((p) => (
          <div key={p._id} className="prod1">
            <Link to={`/product/${p._id}`}>
              <img src={p.image} className="prod1-img" alt={p.name} />
              <p className="prod-name">{p.name}</p>
              <p className="prod-price">{p.price} PKR</p>
            </Link>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>No weekly products available.</p>
      )}
    </div>
  );
};

export default WeeklyLineup;
