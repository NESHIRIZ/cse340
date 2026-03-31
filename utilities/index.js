/* ****************************************
 * Utilities file
 **************************************** */

const inventoryModel = require('../models/inventoryModel');

// Create an object to hold utility functions
const Util = {};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Navigation Function
 ******************************************/

Util.getNav = async () => {
  try {
    let data = await inventoryModel.getClassifications();
    let nav = '<ul>';
    nav += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      nav += '<li>';
      nav += '<a href="/vehicles/type/' + row.classification_id + '" title="See our ' + row.classification_name + ' lineup">';
      nav += row.classification_name + '</a>';
      nav += '</li>';
    });
    nav += '</ul>';
    return nav;
  } catch (error) {
    // Fallback navigation if database is unavailable
    let nav = '<ul>';
    nav += '<li><a href="/" title="Home page">Home</a></li>';
    nav += '</ul>';
    return nav;
  }
};

/* ****************************************
 * Build Classification List for Select
 **************************************** */
Util.buildClassificationList = async (classification_id = null) => {
  try {
    let data = await inventoryModel.getClassifications();
    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    // Fallback if database is unavailable
    return '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>';
  }
};

/* ****************************************
 * Build Vehicle Detail HTML
 **************************************** */
Util.buildVehicleDetailHTML = (vehicle) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${vehicle.inv_make} ${vehicle.inv_model} Details</title>
      <link rel="stylesheet" href="/css/styles.css">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <header>
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      </header>

      <main>
        <div class="vehicle-detail-container">
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-image">
          <ul class="vehicle-info">
            <li><strong>Price:</strong> $${Number(vehicle.inv_price).toLocaleString()}</li>
            <li><strong>Mileage:</strong> ${Number(vehicle.inv_miles).toLocaleString()} km</li>
            <li><strong>Year:</strong> ${vehicle.inv_year}</li>
            <li><strong>Color:</strong> ${vehicle.inv_color}</li>
            <li><strong>Description:</strong> ${vehicle.inv_description}</li>
          </ul>
        </div>
      </main>

      <footer>
        <p>&copy; 2026 Your Dealership Name</p>
      </footer>
    </body>
    </html>
  `;
};

module.exports = Util;