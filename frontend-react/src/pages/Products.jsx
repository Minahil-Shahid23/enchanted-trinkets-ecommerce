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
        const searchQuery = params.get("search"); // 1. Search term pakra

        const response = await axios.get('http://localhost:8025/api/products');
        const allData = response.data.data || response.data;

        let filteredData = allData;

        // 2. Category filter apply karein
        if (categoryFilter) {
          filteredData = filteredData.filter(p =>
            p.category.toLowerCase() === categoryFilter.toLowerCase()
          );
        }

        // 3. Search filter apply karein (agar user ne search kiya hai)
        if (searchQuery) {
          filteredData = filteredData.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Data fetch karne mein ghalti:", error);
        setLoading(false);
      }
    };

    getProducts();
    window.scrollTo(0, 0);
  }, [location.search]);

  // handleSort wala function same rahega...
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

  if (loading) return <h2 style={{ textAlign: 'center', padding: '50px' }}>Loading Products... ✨</h2>;

  // Title ko dynamically change karein agar search ho raha hai
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search");
  const categoryName = params.get("category");
  
  const pageTitle = searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : (categoryName || "Our Collection");

  return (
    <>
      <Navbar cartCount={cartCount} />

      <div className="Weekly-texts-necklace">
        <h1>{pageTitle}</h1>
      </div>

      <div className="breadcrumb">
        <Link to="/">🏠︎ Home</Link> <span>/</span> <Link to="/products">Products</Link>
        {categoryName && (<span> / {categoryName}</span>)}
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
              <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px', backgroundColor: '#fdf9fb', borderRadius: '15px' }}>
    <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔍</div>
    <h3 style={{ color: '#4F5D2F', fontSize: '24px', marginBottom: '10px' }}>
        No results found for "{searchQuery}"
    </h3>
    <p style={{ color: '#666', marginBottom: '25px', fontSize: '16px' }}>
        We couldn't find any matches. Please check your spelling or try searching for something else.
    </p>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button 
            onClick={() => window.location.href='/products'}
            style={{ 
                padding: '12px 25px', 
                backgroundColor: '#4F5D2F', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: '600'
            }}
        >
            Browse All Products
        </button>
        <Link 
            to="/" 
            style={{ 
                padding: '12px 25px', 
                border: '1px solid #4F5D2F', 
                color: '#4F5D2F', 
                textDecoration: 'none', 
                borderRadius: '5px',
                fontWeight: '600'
            }}
        >
            Back to Home
        </Link>
    </div>
</div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;