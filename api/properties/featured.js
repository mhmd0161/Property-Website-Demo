const allProperties = require("../../server/data");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(allProperties.filter((p) => p.isFeatured));
};
