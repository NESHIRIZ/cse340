const utilities = require("./utilities");
const baseController = require("./controllers/baseController");

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static")

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(staticRoutes)

/* ***********************
 * Index Route
 *************************/
app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App running at http://${host}:${port}`)
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();  // build navigation
  console.error(`Error at: "${req.originalUrl}": ${err.message}`); // log error
  res.render("errors/error", {        // render the error view
    title: err.status || 'Server Error',
    message: err.message,
    nav
  });
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

const utilities = require("./utilities");

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

const vehicleRoutes = require('./routes/vehicles');

app.use('/', vehicleRoutes); // use the route