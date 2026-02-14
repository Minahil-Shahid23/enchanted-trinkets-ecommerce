import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    interest: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await axios.post('http://localhost:8025/api/contact', {
        fullname: formData.fullname,
        email: formData.email,
        interest: formData.interest,
        message: formData.message
      });

      if (response.status === 201 || response.status === 200) {
        setStatus('✅ Message sent successfully!');
        setFormData({ fullname: '', email: '', interest: '', message: '' });
      }
    } catch (error) {
      console.error("Contact error:", error.response?.data);
      setStatus(`❌ Error: ${error.response?.data?.message || 'Failed to send'}`);
    }
  };

  return (
    <>
      <div className="Contact-text" id="contact">
        <h1>Talk to Us About Your Dream Jewelry</h1>
      </div>

      <div className="split-container">
        <div className="left-info">
          <div className="branding">
            <div className="subtitle">We are here to help you to shine</div>

            <h1>
              Let’s Talk About Your <span className="highlight">Jewelry</span> Needs
            </h1>

            <p className="desc">
              Are you looking for a custom piece, repair service, or consultation?<br />
              Reach out—we’d love to assist you.
            </p>

            <div className="contact-details">
              <div className="contact-row">
                <span className="icon">📧</span>
                <span>Email</span><br />
                <span className="contact-value">
                  maryyamtanveer485@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-form">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Contact Us</h2>

            {status && (
              <p className={`status-msg ${status.includes('❌') ? 'error' : 'success'}`}>
                {status}
              </p>
            )}

            <div className="form-group">
              <label htmlFor="fullname">Full Name<span className="required">*</span></label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address<span className="required">*</span></label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="interest">Interested In<span className="required">*</span></label>
              <select
                id="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Custom Jewelry">Custom Jewelry</option>
                <option value="Repair">Repair</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message<span className="required">*</span></label>
              <textarea
                id="message"
                rows="4"
                placeholder="Tell us what you're looking for..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Get in Touch
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
