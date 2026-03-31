const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const validate = require("../utilities/validation");
const { requireEmployeeOrAdmin } = require("../utilities/auth");

/* ***********************
 * Middleware to build nav and classification select
 *************************/
const prepareInventoryData = async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
  res.locals.classificationSelect = await utilities.buildClassificationList();
  next();
};

/* ***********************
 * Management View Route
 *************************/
router.get("/", utilities.handleErrors(prepareInventoryData), requireEmployeeOrAdmin, utilities.handleErrors(inventoryController.buildManagementView));

/* ***********************
 * Add Classification Routes
 *************************/
// Deliver add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(prepareInventoryData),
  requireEmployeeOrAdmin,
  utilities.handleErrors(inventoryController.buildAddClassificationView)
);

// Process add classification (POST)

  router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  invController.addClassification
);

/* ***********************
 * Add Inventory Routes
 *************************/
// Deliver add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(prepareInventoryData),
  requireEmployeeOrAdmin,
  utilities.handleErrors(inventoryController.buildAddInventoryView)
);

// Process add inventory (POST)
router.post(
  "/add-inventory",
  utilities.handleErrors(prepareInventoryData),
  requireEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventory)
);

module.exports = router;
