const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to show vehicles by classification
router.get('/type/:classificationId', inventoryController.getVehiclesByClassification);

// Route to show vehicle detail page
router.get('/:id', inventoryController.getVehicleDetail);

module.exports = router;