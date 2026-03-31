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
      nav: res.locals.nav
    });
  }

  next();
};
