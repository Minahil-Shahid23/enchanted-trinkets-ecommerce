import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>Enchanted Trinkets</h3>
        <p>
          Step into a world of timeless elegance — handcrafted jewelry for the
          romantic soul.
        </p>
      </div>

      <div className="footer-section">
        <h3>Contact Us</h3>
        <ul>
          <li>
            <a href="mailto:maryyamtanveer485@gmail.com">maryyamtanveer485@gmail.com</a>
          </li>
          <li>
            <a href="mailto:minahilsh3@gmail.com">minahilsh3@gmail.com</a>
          </li>
        </ul>
      </div>

      <div className="footer-section">
        <h3>Information</h3>
        <ul>
          <li><a href="#about-section">About Us</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Handle With Care</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a 
            href="https://www.instagram.com/enchantedd_trinketss" 
            target="_blank" 
            rel="noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>

          <a 
            href="https://www.pinterest.com/maryyamsheikh115/" 
            target="_blank" 
            rel="noreferrer"
          >
            <i className="fab fa-pinterest"></i>
          </a>
          
          <a 
            href="https://www.tiktok.com/@enchantedd_trinketss/" 
            target="_blank" 
            rel="noreferrer"
          >
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>

      <div className="copyright">
        <p>© 2025 Enchanted Trinkets. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;