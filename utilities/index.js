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

module.exports = Util;


const Util = {};

// Dummy navigation function
Util.getNav = async () => {
  return "<a href='/'>Home</a> | <a href='/about'>About</a>";
};

/* Higher-order function for handling errors */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Build Vehicle Detail HTML
 **************************************** */
Util.buildVehicleDetailHTML = (vehicle) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${vehicle.make} ${vehicle.model} Details</title>
      <link rel="stylesheet" href="/css/style.css">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <header>
        <h1>${vehicle.make} ${vehicle.model}</h1>
        <nav>${Util.getNav()}</nav>
      </header>

      <main>
        <div class="vehicle-detail-container">
          <img src="${vehicle.image_url}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
          <ul class="vehicle-info">
            <li><strong>Price:</strong> $${Number(vehicle.price).toLocaleString()}</li>
            <li><strong>Mileage:</strong> ${Number(vehicle.mileage).toLocaleString()} km</li>
            <li><strong>Year:</strong> ${vehicle.year}</li>
            <li><strong>Color:</strong> ${vehicle.color}</li>
            <li><strong>Description:</strong> ${vehicle.description}</li>
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
