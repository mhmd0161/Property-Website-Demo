const allProperties = require("../../server/data");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const property = allProperties.find((p) => p.id === parseInt(req.query.id));
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
};
