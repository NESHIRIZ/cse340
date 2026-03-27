const utilities = require("./utilities");
const baseController = require("./controllers/baseController");

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static");
const vehicleRoutes = require("./routes/vehicles");

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(staticRoutes);

/* ***********************
 * Routes
 *************************/

// Home route (MVC)
app.get("/", utilities.handleErrors(baseController.buildHome));

// Vehicle routes
app.use("/vehicles", vehicleRoutes);

/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App running at http://${host}:${port}`);
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error("FULL ERROR:", err);
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

/* ***********************
 * 404 Handler
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});