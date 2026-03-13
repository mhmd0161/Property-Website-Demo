import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "./HomePage.css";

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("buy");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/properties/featured")
      .then((r) => r.json())
      .then(setFeatured)
      .catch(() => {});

    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (searchType === "rent") params.set("status", "For Rent");
    if (searchType === "buy") params.set("status", "For Sale");
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Trusted by 10,000+ happy clients</div>
          <h1>Find Your Perfect <span>Dream Home</span></h1>
          <p>Explore thousands of properties for sale and rent. Your next chapter starts here.</p>

          <div className="search-box">
            <div className="search-tabs">
              {["buy", "rent"].map((t) => (
                <button
                  key={t}
                  className={`tab-btn ${searchType === t ? "active" : ""}`}
                  onClick={() => setSearchType(t)}
                >
                  {t === "buy" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by city, neighborhood, or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="stats-bar">
          <div className="container stats-inner">
            <div className="stat">
              <strong>{stats.total}+</strong>
              <span>Total Properties</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>{stats.forSale}+</strong>
              <span>For Sale</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>{stats.forRent}+</strong>
              <span>For Rent</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>{stats.cities}+</strong>
              <span>Cities</span>
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Handpicked for You</p>
              <h2 className="section-title">Featured Properties</h2>
            </div>
            <button className="view-all-btn" onClick={() => navigate("/properties")}>
              View All Properties
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {featured.length > 0 ? (
            <div className="properties-grid">
              {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="loading-cards">
              {[1,2,3].map((i) => <div key={i} className="skeleton-card"></div>)}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="why-us">
        <div className="container">
          <div className="section-header center">
            <div>
              <p className="section-label">Why Choose Us</p>
              <h2 className="section-title">The EstatePro Advantage</h2>
            </div>
          </div>
          <div className="features-grid">
            {[
              { icon: "🏠", title: "Curated Listings", desc: "Every property is vetted by our experts to ensure quality and accuracy." },
              { icon: "🤝", title: "Expert Agents", desc: "Our certified agents guide you through every step of the buying or renting process." },
              { icon: "🔒", title: "Secure Transactions", desc: "We use industry-leading security to protect your data and transactions." },
              { icon: "📍", title: "Local Knowledge", desc: "Deep neighborhood insights to help you find the perfect location." },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-text">
              <h2>Ready to Find Your Dream Home?</h2>
              <p>Browse our full catalog of properties across the United States.</p>
            </div>
            <button className="cta-btn" onClick={() => navigate("/properties")}>
              Explore All Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
