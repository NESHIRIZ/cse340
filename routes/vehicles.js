const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const validation = require('../utilities/validation');
const { requireLogin } = require('../utilities/auth');

// Route to show custom-built vehicles
router.get('/custom', inventoryController.getCustomVehicles);
router.post('/custom', validation.customBuildRules(), validation.checkCustomBuildData, inventoryController.postCustomBuildRequest);

// Route to show vehicles by classification
router.get('/type/:classificationId', inventoryController.getVehiclesByClassification);

// Route to show vehicle detail page
router.get('/:id', inventoryController.getVehicleDetail);

// Route to submit a vehicle review (must be logged in)
router.post('/:id/review', requireLogin, validation.reviewRules(), validation.checkReviewData, inventoryController.postVehicleReview);

module.exports = router;