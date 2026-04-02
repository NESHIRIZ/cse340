// baseController.js
const utilities = require("../utilities"); // we’ll create this next

// Home page controller
exports.buildHome = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); // get navigation
    let classificationGrid = await utilities.buildClassificationGrid(); // get classification grid
    let topVehicles = await utilities.getTopRatedVehicles(5); // new top rated vehicles
    res.render("index", { title: "Home", nav, classificationGrid, topVehicles });
  } catch (err) {
    next(err); // forward errors to the Express error handler
  }
};
// Trigger error for testing
exports.triggerError = async (req, res, next) => {
  try {
    throw new Error('Intentional error for testing error handling.');
  } catch (err) {
    next(err);
  }
};