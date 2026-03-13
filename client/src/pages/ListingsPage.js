import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "./ListingsPage.css";

const TYPES = ["All", "Apartment", "House", "Villa", "Penthouse", "Townhouse"];
const STATUSES = ["All", "For Sale", "For Rent"];
const BEDS = ["Any", "1+", "2+", "3+", "4+"];

function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "All",
    type: searchParams.get("type") || "All",
    bedrooms: "Any",
    minPrice: "",
    maxPrice: "",
  });

  const [inputSearch, setInputSearch] = useState(filters.search);

  const buildQuery = useCallback((f) => {
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.status && f.status !== "All") params.set("status", f.status);
    if (f.type && f.type !== "All") params.set("type", f.type);
    if (f.bedrooms && f.bedrooms !== "Any") params.set("bedrooms", f.bedrooms.replace("+", ""));
    if (f.minPrice) params.set("minPrice", f.minPrice);
    if (f.maxPrice) params.set("maxPrice", f.maxPrice);
    return params.toString();
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = buildQuery(filters);
    fetch(`/api/properties${query ? `?${query}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters, buildQuery]);

  const applyFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilter("search", inputSearch);
  };

  const clearFilters = () => {
    const empty = { search: "", status: "All", type: "All", bedrooms: "Any", minPrice: "", maxPrice: "" };
    setFilters(empty);
    setInputSearch("");
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.search,
    filters.status !== "All",
    filters.type !== "All",
    filters.bedrooms !== "Any",
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="listings-page">
      {/* Page Header */}
      <div className="listings-header">
        <div className="container">
          <h1>Browse Properties</h1>
          <p>Find the perfect property from our curated listings</p>
        </div>
      </div>

      <div className="container listings-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? "open" : ""}`}>
          <div className="filters-header">
            <h3>Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}</h3>
            {activeFilterCount > 0 && (
              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            )}
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <form onSubmit={handleSearchSubmit} className="filter-search">
              <input
                type="text"
                placeholder="City, address, type..."
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
              />
              <button type="submit">Go</button>
            </form>
          </div>

          {/* Status */}
          <div className="filter-group">
            <label>Status</label>
            <div className="chip-group">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`chip ${filters.status === s ? "active" : ""}`}
                  onClick={() => applyFilter("status", s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="filter-group">
            <label>Property Type</label>
            <div className="chip-group wrap">
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={`chip ${filters.type === t ? "active" : ""}`}
                  onClick={() => applyFilter("type", t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div className="filter-group">
            <label>Bedrooms</label>
            <div className="chip-group">
              {BEDS.map((b) => (
                <button
                  key={b}
                  className={`chip ${filters.bedrooms === b ? "active" : ""}`}
                  onClick={() => applyFilter("bedrooms", b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min £"
                value={filters.minPrice}
                onChange={(e) => applyFilter("minPrice", e.target.value)}
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max £"
                value={filters.maxPrice}
                onChange={(e) => applyFilter("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="listings-main">
          <div className="listings-toolbar">
            <span className="results-count">
              {loading ? "Loading..." : `${total} propert${total !== 1 ? "ies" : "y"} found`}
            </span>
            <button className="mobile-filter-btn" onClick={() => setShowFilters(!showFilters)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {loading ? (
            <div className="grid-skeleton">
              {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : properties.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters to see more results.</p>
              <button className="clear-btn-lg" onClick={clearFilters}>Clear All Filters</button>
            </div>
          ) : (
            <div className="listings-grid">
              {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingsPage;
