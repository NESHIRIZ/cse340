// baseController.js
const utilities = require("../utilities"); // we’ll create this next

// Home page controller
exports.buildHome = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); // get navigation
    res.render("index", { title: "Home", nav });
  } catch (err) {
    next(err); // forward errors to the Express error handler
  }
};