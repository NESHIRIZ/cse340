/* ****************************************
 * Utilities file
 **************************************** */

// Create an object to hold utility functions
const Util = {};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Dummy Navigation Function
 **************************************** */
Util.getNav = async () => {
  return "<a href='/'>Home</a> | <a href='/about'>About</a>";
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
      <link rel="stylesheet" href="/css/style.css">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <header>
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <nav>${Util.getNav()}</nav>
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