import React from "react";
import { Link } from "react-router-dom";
import "./PropertyCard.css";

function formatPrice(price, status) {
  if (status === "For Rent") return `£${price.toLocaleString()}/mo`;
  return `£${(price / 1000).toFixed(0)}k`;
}

function PropertyCard({ property }) {
  const { id, title, type, status, price, bedrooms, bathrooms, area, location, images, isFeatured } = property;

  return (
    <Link to={`/properties/${id}`} className="property-card">
      <div className="card-image-wrap">
        <img src={images[0]} alt={title} loading="lazy" />
        <div className="card-badges">
          <span className={`badge ${status === "For Sale" ? "badge-sale" : "badge-rent"}`}>{status}</span>
          {isFeatured && <span className="badge badge-featured">Featured</span>}
        </div>
        <div className="card-type">{type}</div>
      </div>

      <div className="card-body">
        <div className="card-price">{formatPrice(price, status)}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location.city}, {location.state || location.county}
        </p>

        <div className="card-specs">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 22v-8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8M3 9h18l-2-7H5L3 9zM9 14v4M15 14v4" />
            </svg>
            {bedrooms === 0 ? "Studio" : `${bedrooms} Bed`}
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l1 1M9 6a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM4 20h16M4 20v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" />
            </svg>
            {bathrooms} Bath
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            {area.toLocaleString()} ft²
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
