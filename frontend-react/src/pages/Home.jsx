import '../index.css'; 
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Shop from '../components/Shop';
import Feedback from '../components/Feedback';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WeeklyLineup from '../components/WeeklyLineup';

// 1. Props mein cartCount receive karein
const Home = ({ cartCount }) => {
  return (
    <div className="app-container">
      {/* 2. Navbar ko cartCount pass karein */}
      <Navbar cartCount={cartCount} />
      
<Hero />
<div id="about"><About /></div> {/* Div wrap karke id dena zyada safe hai */}
<div id="shop"><Shop /></div>

<div className="Weekly-text">
  <h1>Weekly Lineup</h1>
</div>

<WeeklyLineup />
<Feedback />
<div id="contact"><Contact /></div>
<Footer />
    </div>
  );
};

export default Home;