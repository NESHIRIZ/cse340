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
    nav += '<li><a href="/vehicles/custom" title="Explore custom builds">Custom Builds</a></li>';
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
  `;
};

/* ****************************************
 * Build Classification Grid for Home Page
 **************************************** */
Util.buildClassificationGrid = async () => {
  try {
    let data = await inventoryModel.getClassifications();
    let grid = '<div class="classification-grid">';
    data.rows.forEach((row) => {
      grid += '<div class="classification-card">';
      grid += '<h3>' + row.classification_name + '</h3>';
      grid += '<p>' + getClassificationDescription(row.classification_name) + '</p>';
      grid += '<a href="/vehicles/type/' + row.classification_id + '" class="btn-secondary">View ' + row.classification_name + 's</a>';
      grid += '</div>';
    });
    grid += '</div>';
    return grid;
  } catch (error) {
    return '<p>Unable to load classifications.</p>';
  }
};

/* ****************************************
 * Get top rated vehicles for homepage
 **************************************** */
Util.getTopRatedVehicles = async (limit = 5) => {
  try {
    const data = await inventoryModel.getTopRatedVehicles(limit);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* Helper function for classification descriptions */
function getClassificationDescription(name) {
  const descriptions = {
    'Sedan': 'Comfortable and efficient vehicles for everyday driving.',
    'Sports': 'High-performance vehicles for the thrill seeker.',
    'SUV': 'Spacious and versatile for family adventures.',
    'Utility': 'Unique and special vehicles for the discerning buyer.',
    'Truck': 'Rugged and powerful for work and play.',
    'Custom': 'Unique and special vehicles for the discerning buyer.'
  };
  return descriptions[name] || 'Explore our ' + name + ' collection.';
}

module.exports = Util;