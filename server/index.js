const express = require("express");
const cors = require("cors");
const properties = require("./data");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// GET all properties with optional filters
app.get("/api/properties", (req, res) => {
  let result = [...properties];
  const { status, type, city, minPrice, maxPrice, bedrooms, search } = req.query;

  if (status) result = result.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  if (type) result = result.filter((p) => p.type.toLowerCase() === type.toLowerCase());
  if (city) result = result.filter((p) => p.location.city.toLowerCase().includes(city.toLowerCase()));
  if (bedrooms) result = result.filter((p) => p.bedrooms >= parseInt(bedrooms));
  if (minPrice) result = result.filter((p) => p.price >= parseInt(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= parseInt(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }

  res.json({ total: result.length, properties: result });
});

// GET featured properties
app.get("/api/properties/featured", (req, res) => {
  const featured = properties.filter((p) => p.isFeatured);
  res.json(featured);
});

// GET single property by id
app.get("/api/properties/:id", (req, res) => {
  const property = properties.find((p) => p.id === parseInt(req.params.id));
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
});

// POST new property listing
app.post("/api/properties", (req, res) => {
  const body = req.body;
  const required = ["title", "type", "status", "price", "bedrooms", "bathrooms", "area", "location", "description"];
  const missing = required.filter((k) => !body[k]);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });

  const newProperty = {
    ...body,
    id: properties.length ? Math.max(...properties.map((p) => p.id)) + 1 : 1,
    price: parseFloat(body.price),
    bedrooms: parseInt(body.bedrooms),
    bathrooms: parseInt(body.bathrooms),
    area: parseInt(body.area),
    images: body.images && body.images.length ? body.images : ["https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80"],
    agent: body.agent || { name: "EstatePro Team", phone: "+44 20 7946 0000", email: "listings@estatepro.co.uk", avatar: "https://i.pravatar.cc/150?img=60" },
    listedDate: new Date().toISOString().split("T")[0],
    isFeatured: false,
  };
  properties.push(newProperty);
  res.status(201).json(newProperty);
});

// GET stats summary
app.get("/api/stats", (req, res) => {
  res.json({
    total: properties.length,
    forSale: properties.filter((p) => p.status === "For Sale").length,
    forRent: properties.filter((p) => p.status === "For Rent").length,
    cities: [...new Set(properties.map((p) => p.location.city))].length,
  });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
