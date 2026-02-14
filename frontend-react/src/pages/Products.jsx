import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Products = ({ cartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const categoryFilter = params.get("category");

        const response = await axios.get('http://localhost:8025/api/products');
        const allData = response.data.data || response.data;

        if (categoryFilter) {
          const filteredData = allData.filter(p =>
            p.category.toLowerCase() === categoryFilter.toLowerCase()
          );
          setProducts(filteredData);
        } else {
          setProducts(allData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Data fetch karne mein ghalti:", error);
        setLoading(false);
      }
    };

    getProducts();
    window.scrollTo(0, 0);
  }, [location.search]);

  const handleSort = (e) => {
    const sortValue = e.target.value;
    let sortedList = [...products];

    if (sortValue === "lowToHigh") {
      sortedList.sort((a, b) => a.price - b.price);
    } else if (sortValue === "highToLow") {
      sortedList.sort((a, b) => b.price - a.price);
    }

    setProducts(sortedList);
  };

  if (loading)
    return (
      <h2 style={{ textAlign: 'center', padding: '50px' }}>
        Loading Products... ✨
      </h2>
    );

  const pageTitle =
    new URLSearchParams(location.search).get("category") || "Our Collection";

  return (
    <>
      <Navbar cartCount={cartCount} />

      <div className="Weekly-texts-necklace">
        <h1>{pageTitle}s</h1>
      </div>

      <div className="breadcrumb">
        <a href="/">🏠︎ Home</a> <span>/</span> <a href="/products">{pageTitle}</a>
      </div>

      <div className="filters">
        <select id="filter-category" onChange={handleSort}>
          <option value="all">Sort by Price</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p._id} className="product-card">
              <Link to={`/product/${p._id}`} className="product-card">
                <img
                  src={p.images?.[0] || p.image}
                  alt={p.name}
                  className="search-prod-img"
                />
                <h3 className="search-prod-name">{p.name}</h3>
                <p className="search-prod-price">Rs {p.price}</p>
              </Link>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
            <h3>No products found in this category. 💍</h3>
            <Link
              to="/products"
              style={{ color: '#4F5D2F', textDecoration: 'underline' }}
            >
              Explore All Collections
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
