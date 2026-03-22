const inventoryModel = require('../models/inventoryModel');
const { buildVehicleDetailHTML } = require('../utilities/index');

exports.getVehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicle = await inventoryModel.getVehicleById(vehicleId);

    if (!vehicle) {
      // If no vehicle found, show an error page
      res.status(404).render('error', { message: 'Vehicle not found' });
      return;
    }

    const htmlContent = buildVehicleDetailHTML(vehicle);
    res.send(htmlContent);
  } catch (error) {
    next(error); // Pass error to your middleware
  }
};