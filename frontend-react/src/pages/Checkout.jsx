import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/checkout.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Live Backend URL yahan add kiya
const BASE_URL = 'https://enchanted-backend.vercel.app';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0 || shippingCost === 0) {
      setIsShaking(true);
      setErrorMsg(cartItems.length === 0 ? "Your cart is empty! 🥺" : "Please select a shipping method! 🚚");
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const orderData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      phone: formData.phone || "Not Provided",
      country: "Pakistan",
      shippingMethod: shippingCost === 400 ? "Express" : "Standard",
      items: cartItems.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty
      })),
      total: total,
      status: "Pending"
    };

    try {
      // 2. Localhost ko BASE_URL se replace kar diya
      const response = await axios.post(`${BASE_URL}/api/orders`, orderData);

      if (response.status === 201 || response.status === 200) {
        const orderId = response.data._id || "SUCCESS";
        alert(`Order Placed Successfully! ✨\nOrder ID: ${orderId}`);
        localStorage.removeItem("cart");
        navigate("/");
      }
    } catch (error) {
      console.error("Order error:", error.response?.data);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      setErrorMsg(serverMsg || "Order failed! Check all fields.");
    }
  };

  return (
    <>
      <div className={`checkout-page-root ${isShaking ? 'shake' : ''}`}>
        <Navbar cartCount={cartItems.length} />

        <div className="Weekly-texts-necklace">
          <h1>Checkout</h1>
        </div>

        <div className="checkout-container">
          <div className="checkout-form">
            <h2>Checkout</h2>

            {errorMsg && (
              <div className="pay-now-msg" style={{ background: '#ffeded', color: 'red', padding: '10px', marginBottom: '15px', borderRadius: '5px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <input type="email" name="email" className="field email" placeholder="Email address" required onChange={handleInputChange} />
              </div>

              <div className="form-group name-group">
                <input type="text" name="firstName" className="field" placeholder="First name" required onChange={handleInputChange} />
                <input type="text" name="lastName" className="field" placeholder="Last name" required onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <select className="field shipping" required onChange={(e) => setShippingCost(Number(e.target.value))}>
                  <option value="">Select Shipping Method</option>
                  <option value="200">Standard - Rs. 200</option>
                  <option value="400">Express - Rs. 400</option>
                </select>
              </div>

              <div className="form-group">
                <input type="text" name="address" className="field address" placeholder="Street address" required onChange={handleInputChange} />
              </div>

              <div className="form-group state-zip">
                <input type="text" name="city" className="field city" placeholder="City" required onChange={handleInputChange} />
                <input type="text" name="state" className="field state" placeholder="State" required onChange={handleInputChange} />
                <input type="text" name="zip" className="field zip" placeholder="ZIP" required onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <input type="text" name="phone" className="field phone" placeholder="Phone" required onChange={handleInputChange} />
              </div>

              <button type="submit" className="pay-now place-order-btn">
                Place Order
              </button>
            </form>
          </div>

          <div className="cart-summary">
            <h3>Review your cart</h3>
            <div className="summary-items-list">
              {cartItems.map((item, index) => (
                <div className="cart-item" key={item._id || item.id || index}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <span>Rs. {item.price} x {item.qty}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-summary">
              <p>Subtotal: <span>Rs. {subtotal}</span></p>
              <p>Shipping: <span>Rs. {shippingCost}</span></p>
              <h4>Total: <span>Rs. {total}</span></h4>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;