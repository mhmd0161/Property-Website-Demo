import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">EP</span>
              <span>EstatePro</span>
            </div>
            <p>Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with their dream homes.</p>
            <div className="footer-social">
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((s) => (
                <a key={s} href="#contact" className="social-btn" aria-label={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Property Types</h4>
            <ul>
              <li><Link to="/properties?type=Apartment">Apartments</Link></li>
              <li><Link to="/properties?type=House">Houses</Link></li>
              <li><Link to="/properties?type=Villa">Villas</Link></li>
              <li><Link to="/properties?type=Penthouse">Penthouses</Link></li>
              <li><Link to="/properties?type=Townhouse">Townhouses</Link></li>
            </ul>
          </div>

          <div className="footer-col" id="about">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                12 Berkeley Square, Mayfair<br />London, W1J 6BS
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.12 6.12l1.17-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +44 20 7946 0800
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                hello@estatepro.co.uk
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EstatePro. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
