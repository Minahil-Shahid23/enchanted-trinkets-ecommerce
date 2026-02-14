import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin.css";

const BASE_URL = 'http://localhost:8025';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [weeklyProducts, setWeeklyProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '', price: '', originalPrice: '', description: '', category: 'Ring', sizes: []
  });

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
      setContacts(cRes.data.data || []);
      setWeeklyProducts(wRes.data);
    } catch (err) { console.error("Fetch error:", err); }
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/${type}/${id}`);
      fetchData();
    } catch (err) { alert("Delete failed"); }
  };

  const handleAddProduct = async () => {
    try {
      const fileInput = document.getElementById("imageFile");
      if (!fileInput.files.length) return alert("Please select at least one image!");

      const imageUrls = [];

      for (let file of fileInput.files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "jewelry_upload");

        const res = await fetch("https://api.cloudinary.com/v1_1/dbaoyczba/image/upload", {
          method: "POST",
          body: data,
        });
        const uploadedImage = await res.json();
        imageUrls.push(uploadedImage.secure_url);
      }

      const finalProductData = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        category: productForm.category,
        sizes: productForm.sizes,
        images: imageUrls,
      };

      const response = await axios.post(`${BASE_URL}/api/products`, finalProductData);

      if (response.status === 201 || response.status === 200) {
        alert("✅ Product Added Successfully!");
        fetchData();
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Error: Product add nahi ho saka. Console check karein.");
    }
  };

  const handleAddWeekly = async () => {
    try {
      const name = document.getElementById("weekly-name").value;
      const price = document.getElementById("weekly-price").value;
      const file = document.getElementById("weekly-image").files[0];

      if (!file) return alert("Please select an image");

      const imageUrl = await uploadToCloudinary(file);

      await axios.post(`${BASE_URL}/api/weekly-products`, {
        name, price, image: imageUrl
      });

      alert("✅ Weekly Product Added!");

      document.getElementById("weekly-name").value = "";
      document.getElementById("weekly-price").value = "";
      document.getElementById("weekly-image").value = "";

      fetchData();
    } catch (err) {
      alert("❌ Error adding weekly product");
    }
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
            {section.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="main">
        {activeSection === 'dashboard' && (
          <div className="section active">
            <h1>Dashboard Overview</h1>
            <div className="cards">
              <div className="card"><h3>🛍️ Total Products</h3><p>{products.length}</p></div>
              <div className="card"><h3>📦 Total Orders</h3><p>{orders.length}</p></div>
              <div className="card"><h3>💰 Revenue</h3><p>PKR {orders.reduce((a, b) => a + (b.total || 0), 0)}</p></div>
            </div>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="section active">
            <h1>Manage Products</h1>
            <table>
              <thead>
                <tr><th>Title</th><th>Price</th><th>Category</th><th>Image</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td><del>₹{p.originalPrice}</del> ₹{p.price}</td>
                    <td>{p.category}</td>
                    <td><img src={p.images?.[0]} width="50" alt="" /></td>
                    <td><button onClick={() => handleDelete('products', p._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="product-form-container">
              <h2>Add New Product</h2>
              <input type="text" placeholder="Title" onChange={e => setProductForm({...productForm, name: e.target.value})} />
              <textarea placeholder="Description" onChange={e => setProductForm({...productForm, description: e.target.value})} />
              <input type="number" placeholder="Original Price" onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} />
              <input type="number" placeholder="Discounted Price" onChange={e => setProductForm({...productForm, price: e.target.value})} />

              <select onChange={e => setProductForm({...productForm, category: e.target.value})}>
                <option value="Ring">Rings</option>
                <option value="Necklace">Necklace</option>
                <option value="Earring">Earrings</option>
              </select>

              <select multiple onChange={e => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setProductForm({...productForm, sizes: values});
              }}>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
              </select>

              <input type="file" multiple id="imageFile" />
              <button className="btn-add" onClick={handleAddProduct}>
                Add Product To DB
              </button>
            </div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="section active">
            <h1>Customer Orders</h1>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Total</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>₹{o.total}</td>
                    <td><span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    <td><button onClick={() => setSelectedOrder(o)}>View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedOrder && (
              <div className="order-details-modal">
                <h3>Order Detail: {selectedOrder._id}</h3>
                <p><strong>Shipping:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
                <ul>
                  {selectedOrder.items?.map((item, i) => (
                    <li key={i}>{item.name} x {item.quantity} - ₹{item.price}</li>
                  ))}
                </ul>
                <button onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            )}
          </div>
        )}

        {activeSection === 'weekly-products' && (
          <div className="section active">
            <h1>Weekly Specials</h1>
            <table>
              <thead>
                <tr><th>Image</th><th>Name</th><th>Price</th><th>Action</th></tr>
              </thead>
              <tbody>
                {weeklyProducts.map(w => (
                  <tr key={w._id}>
                    <td><img src={w.image} width="60" alt="" /></td>
                    <td>{w.name}</td>
                    <td>₹{w.price}</td>
                    <td><button onClick={() => handleDelete('weekly-products', w._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="product-form-container">
              <h2>Add Weekly Product</h2>
              <input type="text" placeholder="Weekly Product Name" id="weekly-name" />
              <input type="number" placeholder="Price" id="weekly-price" />
              <input type="file" id="weekly-image" />
              <button className="btn-add" onClick={handleAddWeekly}>
                Add Weekly Product
              </button>
            </div>
          </div>
        )}
      </div>

      {activeSection === 'contacts' && (
        <div className="section active">
          <h1>Customer Inquiries</h1>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <tr key={c._id}>
                      <td>{c.fullname || "N/A"}</td>
                      <td>{c.email}</td>
                      <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>{c.message}</td>
                      <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "12/20/2025"}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete('contact', c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No messages found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
