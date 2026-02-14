import React from 'react';

const Feedback = () => (
  <div className="feedback-section">
    <h2 className="feedback-heading">What Our Customers Say</h2>
    <div className="feedback-cards">
      <FeedbackCard name="Minahil shahid" role="Most beautiful customer" img="https://randomuser.me/api/portraits/women/44.jpg" text="Absolutely loved the jewelry!" />
      <FeedbackCard name="Meryem tanvir" role="Happy Customer" img="https://randomuser.me/api/portraits/men/32.jpg" text="Fast delivery and beautiful packaging." />
      <FeedbackCard name="Fatima Mirza" role="Returning Client" img="https://randomuser.me/api/portraits/men/65.jpg" text="I always shop here for gifts!" />
    </div>
  </div>
);

const FeedbackCard = ({ name, role, img, text }) => (
  <div className="feedback-card">
    <div className="feedback-bg-shape"></div>
    <img className="feedback-avatar" src={img} alt={name} />
    <h3 className="feedback-name">{name}</h3>
    <p className="feedback-role">{role}</p>
    <p className="feedback-text">"{text}"</p>
  </div>
);

export default Feedback;