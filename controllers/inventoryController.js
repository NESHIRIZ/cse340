const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');

/* ****************************************
 * Get Vehicle Detail
 **************************************** */
exports.getVehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicle = await inventoryModel.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(404).render('errors/error', {
        title: 'Vehicle Not Found',
        message: 'Vehicle not found',
        nav: await utilities.getNav()
      });
    }

    const nav = await utilities.getNav();
    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle);
    const reviews = await inventoryModel.getReviewsByVehicleId(vehicleId);

    res.render("vehicle-detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
      reviews,
      vehicleId,
      user: req.session.user,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Post Vehicle Review
 **************************************** */
exports.postVehicleReview = async (req, res, next) => {
  try {
    const { review_text, rating } = req.body;
    const vehicleId = req.params.id;

    if (!req.session.user) {
      req.flash('error', 'Please log in to submit a review.');
      return res.redirect('/account/login');
    }

    const accountId = req.session.user.account_id;

    const addResult = await inventoryModel.addReview(vehicleId, accountId, review_text, rating);
    if (!addResult) {
      req.flash('error', 'Unable to save your review. Please try again.');
      return res.redirect(`/vehicles/${vehicleId}`);
    }

    req.flash('notice', 'Review submitted successfully.');
    return res.redirect(`/vehicles/${vehicleId}`);
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Get Vehicles by Classification
 **************************************** */
exports.getVehiclesByClassification = async (req, res, next) => {
  try {
    const classificationId = req.params.classificationId;
    const minRating = parseFloat(req.query.minRating) || 0;
    const vehicles = await inventoryModel.getVehiclesByClassification(classificationId, minRating);
    const nav = await utilities.getNav();

    if (!vehicles || vehicles.rows.length === 0) {
      return res.status(404).render('errors/error', {
        title: 'No Vehicles Found',
        message: 'No vehicles found for this classification',
        nav
      });
    }

    const classificationData = await inventoryModel.getClassifications();
    const classification = classificationData.rows.find(c => c.classification_id === parseInt(classificationId));
    const title = classification ? classification.classification_name : 'Vehicles';

    res.render("inventory/classification", {
      title: `${title} Vehicles`,
      nav,
      vehicles: vehicles.rows,
      classification,
      minRating
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Build Management View
 **************************************** */
exports.buildManagementView = async (req, res, next) => {
  const nav = await utilities.getNav();

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    messages: req.flash()
  });
};

/* ****************************************
 * Build Add Classification View
 **************************************** */
exports.buildAddClassificationView = async (req, res, next) => {
  const nav = await utilities.getNav();

  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: req.flash()
  });
};

/* ****************************************
 * Process Add Classification
 **************************************** */
exports.addClassification = async (req, res, next) => {
  const { classification_name } = req.body;

  const result = await inventoryModel.addClassification(classification_name);

  if (!result || result.error || typeof result === 'string') {
    req.flash("error", "Failed to add classification. Please try again.");
    return res.status(400).render("./inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      errors: ['Failed to add classification'],
      classification_name,
      messages: req.flash()
    });
  }

  req.flash("notice", `Classification "${classification_name}" added successfully!`);
  res.redirect("/inv/");
};

/* ****************************************
 * Build Add Inventory View
 **************************************** */
exports.buildAddInventoryView = async (req, res, next) => {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationSelect,
    errors: null,
    messages: req.flash()
  });
};

/* ****************************************
 * Process Add Inventory
 **************************************** */
exports.addInventory = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    classification_id
  } = req.body;

  const result = await inventoryModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    classification_id
  );

  if (!result || result.error || typeof result === 'string') {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    req.flash("error", "Failed to add vehicle. Please try again.");

    return res.status(400).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav: await utilities.getNav(),
      classificationSelect,
      errors: ['Failed to add vehicle'],
      messages: req.flash(),
      ...req.body
    });
  }

  req.flash("notice", `Vehicle "${inv_make} ${inv_model}" added successfully!`);
  res.redirect("/inv/");
};