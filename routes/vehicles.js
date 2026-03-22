const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to show vehicle detail page
router.get('/vehicle/:id', inventoryController.getVehicleDetail);

module.exports = router;