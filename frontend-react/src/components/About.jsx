const About = () => (
  <div className="about" id="about-section">
    <div className="about-text">
      <h1>About Me</h1>
      <p>
        Hi, I’m Maryyam, a 20-year-old computer science student who’s deeply enchanted by tiny sparkly things.
        Enchanted Trinkets is my little corner of the world where tech meets handmade magic.
      </p>
    </div>
    <div className="polaroid-stack">
      <img src="/images/firstpola.jpg" alt="Jewelry 1" className="photo rotate-left" />
      <img src="/images/thirdpola.jpg" alt="Jewelry 3" className="photo rotate-right" />
      <img src="/images/secondpola.jpg" alt="Jewelry 2" className="photo center-photo" />
    </div>
  </div>
);

export default About;