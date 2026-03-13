const allProperties = require("../server/data");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    total: allProperties.length,
    forSale: allProperties.filter((p) => p.status === "For Sale").length,
    forRent: allProperties.filter((p) => p.status === "For Rent").length,
    cities: [...new Set(allProperties.map((p) => p.location.city))].length,
  });
};
