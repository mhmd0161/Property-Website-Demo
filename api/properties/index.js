const allProperties = require("../../server/data");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST") {
    const body = req.body;
    const required = ["title", "type", "status", "price", "bedrooms", "bathrooms", "area", "location", "description"];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    const newProperty = {
      ...body,
      id: allProperties.length + 1,
      price: parseFloat(body.price),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      area: parseInt(body.area),
      images: body.images && body.images.length ? body.images : ["https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80"],
      agent: body.agent || { name: "EstatePro Team", phone: "+44 20 7946 0000", email: "listings@estatepro.co.uk", avatar: "https://i.pravatar.cc/150?img=60" },
      listedDate: new Date().toISOString().split("T")[0],
      isFeatured: false,
    };
    return res.status(201).json(newProperty);
  }

  let result = [...allProperties];
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
};
