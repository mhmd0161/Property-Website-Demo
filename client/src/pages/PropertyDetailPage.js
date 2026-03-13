import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./PropertyDetailPage.css";

function formatPrice(price, status) {
  if (status === "For Rent") return `£${price.toLocaleString()}/mo`;
  return `£${price.toLocaleString()}`;
}

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/properties/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setProperty(data); setLoading(false); })
      .catch(() => { setLoading(false); navigate("/properties"); });
  }, [id, navigate]);

  const handleContact = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading) return (
    <div className="detail-loading">
      <div className="spinner"></div>
      <p>Loading property...</p>
    </div>
  );

  if (!property) return null;

  const { title, type, status, price, bedrooms, bathrooms, area, location, description, features, images, agent, listedDate, isFeatured } = property;

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/properties">Properties</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>

      <div className="container">
        {/* Header Info */}
        <div className="detail-header">
          <div>
            <div className="detail-badges">
              <span className={`badge ${status === "For Sale" ? "badge-sale" : "badge-rent"}`}>{status}</span>
              {isFeatured && <span className="badge badge-featured">Featured</span>}
              <span className="badge badge-type">{type}</span>
            </div>
            <h1 className="detail-title">{title}</h1>
            <p className="detail-address">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {location.address}
            </p>
          </div>
          <div className="detail-price-block">
            <div className="detail-price">{formatPrice(price, status)}</div>
            <div className="detail-listed">Listed {new Date(listedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
        </div>

        <div className="detail-layout">
          {/* Left Column */}
          <div className="detail-left">
            {/* Image Gallery */}
            <div className="gallery">
              <div className="gallery-main">
                <img src={images[activeImg]} alt={title} />
                {images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}>&#8249;</button>
                    <button className="gallery-nav next" onClick={() => setActiveImg((i) => (i + 1) % images.length)}>&#8250;</button>
                  </>
                )}
                <div className="gallery-counter">{activeImg + 1} / {images.length}</div>
              </div>
              {images.length > 1 && (
                <div className="gallery-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`thumb ${activeImg === i ? "active" : ""}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={img} alt={`View ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Specs */}
            <div className="specs-card">
              <div className="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 22v-8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8M3 9h18l-2-7H5L3 9zM9 14v4M15 14v4"/>
                </svg>
                <div>
                  <strong>{bedrooms === 0 ? "Studio" : bedrooms}</strong>
                  <span>{bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
                </div>
              </div>
              <div className="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l1 1M9 6a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM4 20h16M4 20v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4"/>
                </svg>
                <div>
                  <strong>{bathrooms}</strong>
                  <span>{bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
                </div>
              </div>
              <div className="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                <div>
                  <strong>{area.toLocaleString()}</strong>
                  <span>Square Feet</span>
                </div>
              </div>
              <div className="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <div>
                  <strong>{type}</strong>
                  <span>Property Type</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h2>About This Property</h2>
              <p className="detail-desc">{description}</p>
            </div>

            {/* Features */}
            <div className="detail-section">
              <h2>Features & Amenities</h2>
              <div className="features-list">
                {features.map((f) => (
                  <div key={f} className="feature-tag">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="detail-right">
            {/* Agent Card */}
            <div className="agent-card">
              <h3>Listed by</h3>
              <div className="agent-info">
                <img src={agent.avatar} alt={agent.name} className="agent-avatar" />
                <div>
                  <strong>{agent.name}</strong>
                  <span>Licensed Agent</span>
                </div>
              </div>
              <div className="agent-contacts">
                <a href={`tel:${agent.phone}`} className="agent-contact-btn phone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.12 6.12l1.17-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {agent.phone}
                </a>
                <a href={`mailto:${agent.email}`} className="agent-contact-btn email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Agent
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-card">
              <h3>Request a Viewing</h3>
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">✓</div>
                  <h4>Message Sent!</h4>
                  <p>Our agent will contact you within 24 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContact}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone (optional)"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                  <textarea
                    placeholder={`I'm interested in "${title}". Please contact me to schedule a viewing.`}
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailPage;
