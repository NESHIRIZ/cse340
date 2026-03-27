const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to show vehicle detail page
router.get('/:id', inventoryController.getVehicleDetail);

module.exports = router;