import { useState, useEffect } from "react";
import "../styles/cart.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

export default function Cart({ updateCartCount }) {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    if (updateCartCount) {
      updateCartCount();
    }
  }, [cartItems, updateCartCount]);

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
    }
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item._id === id || item.id === id) ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems =>
      prevItems.filter(item => (item._id !== id && item.id !== id))
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      <Navbar cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)} />

      <div className="cart-main">
        <div className="breadcrumb" style={{ padding: "10px 0" }}>
          <Link to="/">Home</Link> <span>/</span> <span>Cart</span>
        </div>

        <div className="cart-items">
          <div className="cart-items-header">
            <h2>Your Bag ({cartItems.length} items)</h2>
            {cartItems.length > 0 && (
              <button className="clear-cart" onClick={clearCart}>
                Empty Bag
              </button>
            )}
          </div>

          <div className="cart-row cart-row-head">
            <div style={{ flex: 2 }}>Product</div>
            <div style={{ flex: 2 }}>Details</div>
            <div style={{ flex: 1 }}>Quantity</div>
            <div style={{ flex: 1, textAlign: "right" }}>Subtotal</div>
          </div>

          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div className="cart-row" key={item._id || item.id || index}>
                <div className="cart-img">
                  <img
                    src={Array.isArray(item.images) ? item.images[0] : item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-details">
                  <div className="cart-title">{item.name}</div>
                  <div className="cart-variant">
                    Size: {item.size || "Standard"}
                  </div>
                </div>

                <div className="cart-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item._id || item.id, item.qty - 1)}
                  >
                    −
                  </button>
                  <input value={item.qty} readOnly />
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item._id || item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-price">
                  Rs. {item.price * item.qty}
                </div>

                <div
                  className="cart-remove"
                  onClick={() => removeItem(item._id || item.id)}
                  title="Remove item"
                >
                  ✕
                </div>
              </div>
            ))
          ) : (
            <div
              className="empty-cart-message"
              style={{ textAlign: "center", padding: "60px 20px" }}
            >
              <h1 style={{ fontSize: "3rem" }}>🥺</h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#888",
                  margin: "15px 0"
                }}
              >
                Your cart is feeling a bit light!
              </p>

              <Link
                to="/products"
                className="btn-add"
                style={{
                  textDecoration: "none",
                  display: "inline-block"
                }}
              >
                Shop New Arrivals
              </Link>
            </div>
          )}

          <div className="cart-actions">
            <Link to="/products" className="continue-shopping">
              ← Back to Shop
            </Link>

            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
              onClick={() =>
                navigate("/checkout", { state: { cartItems, total } })
              }
              style={{
                opacity: cartItems.length === 0 ? 0.5 : 1,
                cursor: cartItems.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              Checkout Now →
            </button>
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px 0"
              }}
            >
              <span>Subtotal:</span>
              <span style={{ fontWeight: "bold" }}>Rs. {total}</span>
            </div>

            <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Shipping & taxes calculated at checkout.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
