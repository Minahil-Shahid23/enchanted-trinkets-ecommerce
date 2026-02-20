import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/product.css";
const BASE_URL = 'https://enchanted-backend.vercel.app';
const ProductDetail = ({ addToCart, cartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("18 inches");
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        let mainProd;

        try {
const res = await axios.get(`${BASE_URL}/api/products/${id}`);
          mainProd = res.data.data || res.data;
        } catch (err) {
const weeklyRes = await axios.get(`${BASE_URL}/api/weekly-products/${id}`);
          mainProd = weeklyRes.data;
        }

        if (mainProd) {
          setProduct(mainProd);

const relatedRes = await axios.get(`${BASE_URL}/api/products`);
          let allProducts = relatedRes.data.data || relatedRes.data;

          if (Array.isArray(allProducts)) {
            const filtered = allProducts.filter(
              (item) => item.category === mainProd.category && item._id !== id
            );

            const shuffled = [...filtered].sort(() => Math.random() - 0.5);
            setRelatedProducts(shuffled.slice(0, 4));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const saveToCart = () => {
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) => item._id === product._id && item.size === size
    );

    const displayImg =
      product.images && product.images.length > 0
        ? product.images[0]
        : product.image;

    if (existingIndex > -1) {
      cart[existingIndex].qty += parseInt(qty);
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: displayImg,
        qty: parseInt(qty),
        size: size,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (typeof addToCart === "function") addToCart();
  };

  const handleAddToCart = () => {
    saveToCart();
    setIsMiniCartOpen(true);
  };

  const handleBuyNow = () => {
    saveToCart();
    navigate("/checkout");
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Loading Details... ✨
      </h2>
    );

  if (!product)
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Product Not Found!
      </h2>
    );

  return (
    <>
      <Navbar cartCount={cartCount} />

      {isMiniCartOpen && (
        <div className="mini-cart-popup">
          <span
            className="mini-cart-close"
            onClick={() => setIsMiniCartOpen(false)}
          >
            ×
          </span>

          <h4 className="mini-cart-heading">Item Added to Cart</h4>

          <div className="mini-cart-details">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : product.image
              }
              alt={product.name}
            />

            <div className="mini-cart-text">
              <p>
                <strong>{product.name}</strong>
              </p>
              <p>Size: {size}</p>
              <p>Rs. {product.price}</p>
              <p style={{ fontSize: "12px", color: "#666" }}>Qty: {qty}</p>
            </div>
          </div>

          <div className="mini-cart-buttons">
            <button onClick={() => navigate("/cart")} className="mini-btn">
              View Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="mini-btn primary"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      <div className="Weekly-texts-necklace">
        <h1>{product.name}</h1>
      </div>

      <div
        className="breadcrumb"
        style={{ padding: "10px 20px", fontSize: "14px" }}
      >
        <a href="/" style={{ textDecoration: "none", color: "#4F5D2F" }}>
          🏠︎ Home
        </a>

        <span style={{ margin: "0 8px" }}>/</span>

        <a
          href={`/products?category=${product.category}`}
          style={{
            textDecoration: "none",
            color: "#4F5D2F",
            textTransform: "capitalize",
          }}
        >
          {product.category}s
        </a>

        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#888" }}>{product.name}</span>
      </div>

      <section className="main-product">
        <div className="product-images">
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : product.image
            }
            alt={product.name}
            className="main-img"
          />
        </div>

        <div className="product-info">
          <div className="product-title">{product.name}</div>

          <div className="price">
            <span style={{ fontWeight: "bold", color: "green" }}>
              Rs. {product.price}
            </span>
            <del style={{ color: "gray", marginLeft: "10px" }}>
              Rs. {product.price + 200}
            </del>
          </div>

          <p className="short-desc">
            {product.description ||
              "Elegant handmade piece, perfect for gifting and daily wear."}
          </p>

          <div className="selection-row">
            <div className="select-box">
              <label>Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="16 inches">16 inches</option>
                <option value="18 inches">18 inches</option>
                <option value="20 inches">20 inches</option>
                <option value="Adjustable">Adjustable</option>
              </select>
            </div>

            <div className="select-box">
              <label>Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, e.target.value))}
                min="1"
              />
            </div>
          </div>

          <div className="actions">
            <button className="add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

        
        </div>
      </section>

      <section className="related-section">
        <h2 className="related-title">You May Also Like</h2>

        <div className="related-products">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => {
              const displayImg =
                item.images && item.images.length > 0
                  ? item.images[0]
                  : item.image;

              return (
                <div key={item._id} className="related-card">
                  <a
                    href={`/product/${item._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={displayImg}
                      alt={item.name}
                      className="related-prod-img"
                    />
                    <div className="name">{item.name}</div>
                    <div className="price">Rs. {item.price}</div>
                  </a>

                  <button
                    className="add-cart-btn"
                    onClick={() => {
                      let cart =
                        JSON.parse(localStorage.getItem("cart")) || [];

                      cart.push({
                        ...item,
                        image: displayImg,
                        qty: 1,
                        size: "18 inches",
                      });

                      localStorage.setItem("cart", JSON.stringify(cart));

                      if (typeof addToCart === "function") addToCart();

                      alert("Added to cart!");
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })
          ) : (
            <p>Loading similar treasures...</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductDetail;
