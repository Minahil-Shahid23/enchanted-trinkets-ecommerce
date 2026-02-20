import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/admin.css";

const BASE_URL = 'https://enchanted-backend.vercel.app';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [weeklyProducts, setWeeklyProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const initialProductForm = {
    name: '', price: '', originalPrice: '', description: '', category: 'Ring', sizes: []
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, oRes, cRes, wRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products`),
        axios.get(`${BASE_URL}/api/orders`),
        axios.get(`${BASE_URL}/api/contact/all`),
        axios.get(`${BASE_URL}/api/weekly-products`)
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
setContacts(Array.isArray(cRes.data) ? cRes.data : cRes.data.data || []);      setWeeklyProducts(wRes.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/orders/${orderId}`, { status: newStatus });
      if (response.data) {
        alert(`Order status updated to: ${newStatus} 🚢`);
        fetchData();
        setSelectedOrder(null);
      }
    } catch (err) {
      alert("Order status update nahi ho saka.");
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "jewelry_upload");
    const res = await fetch("https://api.cloudinary.com/v1_1/dbaoyczba/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/${type}/${id}`);
      alert("Deleted successfully!");
      fetchData();
    } catch (err) { alert("Delete failed"); }
  };

  const handleAddProduct = async () => {
    try {
      const fileInput = document.getElementById("imageFile");
      if (!fileInput.files.length) return alert("Please select at least one image!");
      const imageUrls = [];
      for (let file of fileInput.files) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }
      const finalProductData = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        images: imageUrls,
      };
      await axios.post(`${BASE_URL}/api/products`, finalProductData);
      alert("✅ Product Added!");
      setProductForm(initialProductForm);
      fileInput.value = ""; 
      fetchData();
    } catch (err) { alert("❌ Error adding product."); }
  };

  const handleAddWeekly = async () => {
    try {
      const name = document.getElementById("weekly-name").value;
      const price = document.getElementById("weekly-price").value;
      const file = document.getElementById("weekly-image").files[0];
      if (!file || !name || !price) return alert("All fields are required!");
      const imageUrl = await uploadToCloudinary(file);
      await axios.post(`${BASE_URL}/api/weekly-products`, { name, price, image: imageUrl });
      alert("✅ Weekly Product Added!");
      document.getElementById("weekly-name").value = "";
      document.getElementById("weekly-price").value = "";
      document.getElementById("weekly-image").value = "";
      fetchData();
    } catch (err) { alert("❌ Error adding weekly product"); }
  };

  return (
    <div className="admin-page-root">
      <div className="sidebar">
        <h2>Jewelry Admin</h2>
        {['dashboard', 'products', 'orders', 'contacts', 'weekly-products'].map(section => (
          <div
            key={section}
            className={`nav-item ${activeSection === section ? 'active' : ''}`}
            onClick={() => { setActiveSection(section); setSelectedOrder(null); }}
          >
            {section.replace('-', ' ').toUpperCase()}
          </div>
        ))}
      </div>

      <div className="main">
        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="section active">
            <h1>Dashboard Overview</h1>
            <div className="cards">
              <div className="card"><h3>🛍️ Total Products</h3><p>{products.length}</p></div>
              <div className="card"><h3>📦 Total Orders</h3><p>{orders.length}</p></div>
              <div className="card"><h3>💰 Total Revenue</h3><p>Rs. {orders.reduce((a, b) => a + (b.total || 0), 0)}</p></div>
            </div>
          </div>
        )}

        {/* PRODUCTS SECTION */}
        {activeSection === 'products' && (
          <div className="section active">
            <h1>Manage Products</h1>
            
            {/* 1. FORM MOVED TO TOP */}
            <div className="product-form-container" style={{marginBottom:'40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px'}}>
              <h2>Add New Product</h2>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <input type="text" placeholder="Product Title" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                    <option value="Ring">Rings</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Earring">Earrings</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Charm">Charm</option>
                </select>
              </div>
              <textarea placeholder="Product Description" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} style={{width: '100%', marginTop: '10px'}} />
              <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                <input type="number" placeholder="Original Price" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} />
                <input type="number" placeholder="Discount Price" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                <input type="file" multiple id="imageFile" />
              </div>
              <button className="btn-add" onClick={handleAddProduct} style={{width:'100%', marginTop:'15px'}}>Add Product To Store</button>
            </div>

            {/* 2. TABLE MOVED TO BOTTOM */}
            <div className="table-container">
              <h2>Product List</h2>
              <table>
                <thead>
                  <tr><th>Title</th><th>Price</th><th>Category</th><th>Image</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td><del>Rs.{p.originalPrice}</del> <span style={{color:'green'}}>Rs.{p.price}</span></td>
                      <td>{p.category}</td>
                      <td><img src={p.images?.[0]} width="50" height="50" style={{objectFit:'cover', borderRadius:'4px'}} alt="" /></td>
                      <td><button className="btn-delete" onClick={() => handleDelete('products', p._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS SECTION */}
        {activeSection === 'orders' && (
          <div className="section active">
            <h1>Customer Orders</h1>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{o.name}</td>
                      <td>{o.email}</td>
                      <td>Rs.{o.total}</td>
                      <td><span className={`status-badge ${o.status?.toLowerCase() || 'pending'}`}>{o.status || 'Pending'}</span></td>
                      <td><button onClick={() => setSelectedOrder(o)}>View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WEEKLY PRODUCTS SECTION */}
        {activeSection === 'weekly-products' && (
          <div className="section active">
            <h1>Weekly Specials</h1>

            {/* FORM MOVED TO TOP */}
            <div className="product-form-container" style={{marginBottom:'30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px'}}>
              <h2>Add Weekly Special</h2>
              <div style={{display:'flex', gap:'10px'}}>
                <input type="text" placeholder="Product Name" id="weekly-name" style={{flex: 2}} />
                <input type="number" placeholder="Price" id="weekly-price" style={{flex: 1}} />
                <input type="file" id="weekly-image" style={{flex: 1}} />
              </div>
              <button className="btn-add" onClick={handleAddWeekly} style={{width:'100%', marginTop:'10px'}}>Add Weekly</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Image</th><th>Name</th><th>Price</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {weeklyProducts.map(w => (
                    <tr key={w._id}>
                      <td><img src={w.image} width="50" height="50" style={{objectFit:'cover'}} alt="" /></td>
                      <td>{w.name}</td>
                      <td>Rs.{w.price}</td>
                      <td><button className="btn-delete" onClick={() => handleDelete('weekly-products', w._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTACTS SECTION */}
        {activeSection === 'contacts' && (
          <div className="section active">
            <h1>Customer Inquiries</h1>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Message</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id}>
                      <td>{c.fullname || "N/A"}</td>
                      <td>{c.email}</td>
                      <td>{c.message}</td>
                      <td><button className="btn-delete" onClick={() => handleDelete('contact', c._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL - Fixed Position via CSS is recommended */}
      {selectedOrder && (
        <div className="order-details-modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.7)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
          <div className="order-details-modal" style={{background:'white', padding:'25px', borderRadius:'12px', width:'500px', maxWidth:'90%'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Order Details</h3>
              <span className={`status-badge ${selectedOrder.status?.toLowerCase() || 'pending'}`}>
                {selectedOrder.status || 'Pending'}
              </span>
            </div>
            <p><strong>Customer:</strong> {selectedOrder.name}</p>
            <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
            <hr />
            <ul style={{maxHeight: '200px', overflowY: 'auto', padding: '10px 0'}}>
              {selectedOrder.items?.map((item, i) => (
                <li key={i}>{item.name} (x{item.quantity}) - Rs.{item.price}</li>
              ))}
            </ul>
            <h4>Total: Rs.{selectedOrder.total}</h4>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {(selectedOrder.status === 'Pending' || !selectedOrder.status) && (
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder._id, 'Shipped')}
                  style={{ backgroundColor: '#b35394', color: 'white', flex: 2, padding:'10px', border:'none', borderRadius:'5px', cursor:'pointer' }}
                >
                  🚢 Mark as Shipped
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={{ flex: 1, background: '#333', color: 'white', border:'none', borderRadius:'5px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}