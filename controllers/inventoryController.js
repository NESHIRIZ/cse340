const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');

exports.getVehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicle = await inventoryModel.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(404).render('errors/error', {
        title: 'Vehicle Not Found',
        message: 'Vehicle not found',
        nav: utilities.getNav()
      });
    }

    const nav = utilities.getNav();

res.render("vehicle-detail", {
  title: `${vehicle.inv_make} ${vehicle.inv_model}`,
  nav,
  vehicle
});
  } catch (error) {
    next(error);
  }
};