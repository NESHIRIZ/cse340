/* ***********************
 * Load Environment Variables
 *************************/
require("dotenv").config();

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities");
const baseController = require("./controllers/baseController");
const { checkJWTToken } = require("./utilities/auth");

const app = express();

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static");
const vehicleRoutes = require("./routes/vehicles");
const inventoryRoutes = require("./routes/inventory");
const accountsRoutes = require("./routes/accounts");

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Static files
app.use(staticRoutes);

// Simple session-like object if express-session isn't available
app.use((req, res, next) => {
  if (!req.session) {
    req.session = {};
  }
  next();
});

// JWT check middleware (available in all routes)
app.use(utilities.handleErrors(checkJWTToken));

/* ***********************
 * Routes
 *************************/

// Home route (MVC)
app.get("/", utilities.handleErrors(baseController.buildHome));

// Error trigger route
app.get("/error", utilities.handleErrors(baseController.triggerError));

// Accounts routes
app.use("/account", accountsRoutes);

// Vehicle routes
app.use("/vehicles", vehicleRoutes);

// Inventory management routes
app.use("/inv", inventoryRoutes);

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