import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-column">
          <h2>Greenfield School</h2>

          <p>
            Providing quality education and helping students
            develop the knowledge, character, and skills they
            need for a brighter future.
          </p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/teachers">Teachers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Academics */}
        <div className="footer-column">
          <h3>Academics</h3>

          <ul>
            <li>Junior Secondary School</li>
            <li>Senior Secondary School</li>
            <li><Link to="/">Student Activities</Link></li>
            <li><Link to="/">School Facilities</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>📍 Ilorin, Kwara State, Nigeria</p>
          <p>📞 +234 800 000 0000</p>
          <p>✉️ info@greenfieldschool.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Greenfield School. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;