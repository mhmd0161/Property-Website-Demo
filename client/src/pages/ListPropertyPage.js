import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListPropertyPage.css";

const TYPES = ["Apartment", "House", "Villa", "Penthouse", "Townhouse"];
const STATUSES = ["For Sale", "For Rent"];

const INITIAL = {
  title: "",
  type: "Apartment",
  status: "For Sale",
  price: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  address: "",
  city: "",
  county: "",
  description: "",
  features: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
};

function ListPropertyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (form.bedrooms === "" || isNaN(form.bedrooms) || Number(form.bedrooms) < 0) e.bedrooms = "Enter number of bedrooms (0 for studio)";
    if (!form.bathrooms || isNaN(form.bathrooms) || Number(form.bathrooms) <= 0) e.bathrooms = "Enter number of bathrooms";
    if (!form.area || isNaN(form.area) || Number(form.area) <= 0) e.area = "Enter property area";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.agentName.trim()) e.agentName = "Agent name is required";
    if (!form.agentEmail.trim() || !form.agentEmail.includes("@")) e.agentEmail = "Valid agent email is required";
    if (!form.agentPhone.trim()) e.agentPhone = "Agent phone is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        type: form.type,
        status: form.status,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        area: parseInt(form.area),
        location: { city: form.city, state: form.county, address: form.address },
        description: form.description,
        features: form.features ? form.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
        agent: { name: form.agentName, phone: form.agentPhone, email: form.agentEmail, avatar: "https://i.pravatar.cc/150?img=60" },
      };
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      const created = await res.json();
      setSubmitted(true);
      setTimeout(() => navigate(`/properties/${created.id}`), 1800);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="list-page">
        <div className="list-success">
          <div className="success-icon">&#10003;</div>
          <h2>Listing Submitted!</h2>
          <p>Redirecting to your property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-page">
      <div className="list-header">
        <div className="container">
          <h1>List Your Property</h1>
          <p>Fill in the details below to add your property to our listings</p>
        </div>
      </div>

      <div className="container list-body">
        <form className="list-form" onSubmit={handleSubmit} noValidate>

          {/* Property Details */}
          <section className="form-section">
            <h2 className="section-heading">Property Details</h2>

            <div className="form-row">
              <div className={`form-field full ${errors.title ? "has-error" : ""}`}>
                <label htmlFor="title">Property Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Modern Two-Bedroom Apartment in Notting Hill"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Property Type</label>
                <div className="chip-group wrap">
                  {TYPES.map((t) => (
                    <button type="button" key={t} className={`chip ${form.type === t ? "active" : ""}`} onClick={() => set("type", t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>Listing Status</label>
                <div className="chip-group">
                  {STATUSES.map((s) => (
                    <button type="button" key={s} className={`chip ${form.status === s ? "active" : ""}`} onClick={() => set("status", s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row three-col">
              <div className={`form-field ${errors.price ? "has-error" : ""}`}>
                <label htmlFor="price">
                  Price {form.status === "For Rent" ? "(£/month)" : "(£)"}
                </label>
                <div className="input-prefix">
                  <span>£</span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    placeholder={form.status === "For Rent" ? "e.g. 2500" : "e.g. 450000"}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </div>
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>

              <div className={`form-field ${errors.bedrooms ? "has-error" : ""}`}>
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="e.g. 2 (0 = studio)"
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                />
                {errors.bedrooms && <span className="field-error">{errors.bedrooms}</span>}
              </div>

              <div className={`form-field ${errors.bathrooms ? "has-error" : ""}`}>
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  id="bathrooms"
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                />
                {errors.bathrooms && <span className="field-error">{errors.bathrooms}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-field ${errors.area ? "has-error" : ""}`}>
                <label htmlFor="area">Floor Area (sq ft)</label>
                <input
                  id="area"
                  type="number"
                  min="1"
                  placeholder="e.g. 900"
                  value={form.area}
                  onChange={(e) => set("area", e.target.value)}
                />
                {errors.area && <span className="field-error">{errors.area}</span>}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="form-section">
            <h2 className="section-heading">Location</h2>

            <div className="form-row">
              <div className={`form-field full ${errors.address ? "has-error" : ""}`}>
                <label htmlFor="address">Full Address</label>
                <input
                  id="address"
                  type="text"
                  placeholder="e.g. 12 Park Lane, Mayfair, W1K 1QZ"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-field ${errors.city ? "has-error" : ""}`}>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. London"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="county">County / Region</label>
                <input
                  id="county"
                  type="text"
                  placeholder="e.g. Greater London"
                  value={form.county}
                  onChange={(e) => set("county", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Description & Features */}
          <section className="form-section">
            <h2 className="section-heading">Description &amp; Features</h2>

            <div className={`form-field full ${errors.description ? "has-error" : ""}`}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe the property — highlights, nearby amenities, transport links..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-field full">
              <label htmlFor="features">Features / Amenities <span className="label-hint">(comma-separated)</span></label>
              <input
                id="features"
                type="text"
                placeholder="e.g. Garden, Parking, Gym, Concierge"
                value={form.features}
                onChange={(e) => set("features", e.target.value)}
              />
            </div>
          </section>

          {/* Agent / Contact */}
          <section className="form-section">
            <h2 className="section-heading">Contact Details</h2>

            <div className="form-row three-col">
              <div className={`form-field ${errors.agentName ? "has-error" : ""}`}>
                <label htmlFor="agentName">Agent / Contact Name</label>
                <input
                  id="agentName"
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={form.agentName}
                  onChange={(e) => set("agentName", e.target.value)}
                />
                {errors.agentName && <span className="field-error">{errors.agentName}</span>}
              </div>

              <div className={`form-field ${errors.agentPhone ? "has-error" : ""}`}>
                <label htmlFor="agentPhone">Phone Number</label>
                <input
                  id="agentPhone"
                  type="tel"
                  placeholder="e.g. +44 20 7946 0000"
                  value={form.agentPhone}
                  onChange={(e) => set("agentPhone", e.target.value)}
                />
                {errors.agentPhone && <span className="field-error">{errors.agentPhone}</span>}
              </div>

              <div className={`form-field ${errors.agentEmail ? "has-error" : ""}`}>
                <label htmlFor="agentEmail">Email Address</label>
                <input
                  id="agentEmail"
                  type="email"
                  placeholder="e.g. jane@agency.co.uk"
                  value={form.agentEmail}
                  onChange={(e) => set("agentEmail", e.target.value)}
                />
                {errors.agentEmail && <span className="field-error">{errors.agentEmail}</span>}
              </div>
            </div>
          </section>

          {errors.submit && <p className="submit-error">{errors.submit}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Listing"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ListPropertyPage;
