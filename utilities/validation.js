const { body, validationResult } = require("express-validator");

/* ****************************************
 * Classification Rules
 **************************************** */
exports.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("No spaces or special characters allowed.")
  ];
};

/* ****************************************
 * Check Classification Data
 **************************************** */
exports.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      errors: errors.array(),
      classification_name: req.body.classification_name,
      nav: res.locals.nav,
      messages: req.flash()
    });
  }

  next();
};

/* ****************************************
 * Inventory Rules
 **************************************** */
exports.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification is required."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid year."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required.")
  ];
};

/* ****************************************
 * Review Rules
 **************************************** */
exports.reviewRules = () => {
  return [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5.'),
    body('review_text')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Review comment must be between 10 and 500 characters.')
  ];
};

/* ****************************************
 * Check Review Data
 **************************************** */
exports.checkReviewData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => e.msg).join(' ');
    req.flash('error', errorMsg);
    return res.redirect(`/vehicles/${req.params.id}`);
  }

  next();
};

/* ****************************************
 * Check Inventory Data
 **************************************** */
exports.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const invModel = require('../models/inventoryModel');

  if (!errors.isEmpty()) {
    const classificationSelect = await require('../utilities/index').buildClassificationList(req.body.classification_id);
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      errors: errors.array(),
      classificationSelect,
      messages: req.flash(),
      ...req.body,
      nav: res.locals.nav
    });
  }

  next();
};

/* ****************************************
 * Update Account Rules
 **************************************** */
exports.updateAccountRules = () => {
  return [
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("last_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),

    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
  ];
};

/* ****************************************
 * Check Update Account Data
 **************************************** */
exports.checkUpdateAccountData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/account-update", {
      title: "Account Update",
      errors: errors.array(),
      account: req.body,
      nav: res.locals.nav,
      messages: req.flash()
    });
  }

  next();
};

/* ****************************************
 * Password Rules
 **************************************** */
exports.passwordRules = () => {
  return [
    body("password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage("Password must be at least 8 characters and contain uppercase, lowercase, and numbers.")
  ];
};

/* ****************************************
 * Check Password Data
 **************************************** */
exports.checkPasswordData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/account-update", {
      title: "Account Update",
      errors: errors.array(),
      account: req.body,
      nav: res.locals.nav,
      messages: req.flash()
    });
  }

  next();
};

/* ****************************************
 * Registration Rules
 **************************************** */
exports.registrationRules = () => {
  return [
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("last_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),

    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage("Password must be at least 8 characters and contain uppercase, lowercase, and numbers.")
  ];
};

/* ****************************************
 * Check Registration Data
 **************************************** */
exports.checkRegData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      title: "Register",
      errors: errors.array(),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      nav: res.locals.nav,
      messages: req.flash()
    });
  }

  next();
};

/* ****************************************
 * Login Rules
 **************************************** */
exports.loginRules = () => {
  return [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Password is required.")
  ];
};

/* ****************************************
 * Check Login Data
 **************************************** */
exports.checkLoginData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      errors: errors.array(),
      email: req.body.email,
      nav: res.locals.nav,
      messages: req.flash()
    });
  }

  next();
};
