exports.inventoryRules = () => {
  return [];
};

exports.checkInventoryData = async (req, res, next) => {
  const errors = [];

  if (!req.body.inv_make) errors.push("Make required");
  if (!req.body.inv_model) errors.push("Model required");

  if (errors.length > 0) {
    const utilities = require('../utilities/index');
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);

    return res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      errors,
      classificationSelect,
      ...req.body,
      nav: await utilities.getNav()
    });
  }

  next();
};
