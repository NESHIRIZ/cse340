const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const utilities = require('../utilities');
const validate = require('../utilities/validation');
const { checkJWTToken, requireLogin } = require('../utilities/auth');

/* ***********************
 * Middleware to build nav
 *************************/
const prepareData = async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
  next();
};

/* ***********************
 * Account Management View
 *************************/
router.get(
  '/',
  utilities.handleErrors(prepareData),
  requireLogin,
  utilities.handleErrors(accountsController.buildAccountManagement)
);

/* ***********************
 * Account Update View
 *************************/
router.get(
  '/update/:account_id',
  utilities.handleErrors(prepareData),
  requireLogin,
  utilities.handleErrors(accountsController.buildAccountUpdate)
);

/* ***********************
 * Process Account Update
 *************************/
router.post(
  '/update',
  utilities.handleErrors(prepareData),
  requireLogin,
  validate.updateAccountRules(),
  validate.checkUpdateAccountData,
  utilities.handleErrors(accountsController.updateAccount)
);

/* ***********************
 * Process Password Change
 *************************/
router.post(
  '/password',
  utilities.handleErrors(prepareData),
  requireLogin,
  validate.passwordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountsController.updatePassword)
);

/* ***********************
 * Logout
 *************************/
router.get(
  '/logout',
  utilities.handleErrors(accountsController.logout)
);

module.exports = router;
