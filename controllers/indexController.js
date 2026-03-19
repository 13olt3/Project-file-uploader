const passport = require("passport");
const { body, validationResult, matchedData } = require("express-validator");

async function indexPage(req, res) {
  res.render("index", {
    title: "Index Page",
  });
}

module.exports = {
  indexPage,
};
