import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled || !isHome ? "navbar-solid" : "navbar-transparent"}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">EP</span>
          <span className="logo-text">EstatePro</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger ${menuOpen ? "open" : ""}`}></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
          <li><Link to="/properties" className={location.pathname === "/properties" ? "active" : ""}>Properties</Link></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className={`navbar-actions ${menuOpen ? "open" : ""}`}>
          <Link to="/list-property" className="btn-list">List Property</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
