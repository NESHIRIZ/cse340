const accountsModel = require('../models/accountsModel');
const utilities = require('../utilities/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* *****************************
 * Build Account Management View
 *************************** */
exports.buildAccountManagement = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const { account_id, first_name, last_name, email, account_type } = req.session.user;
    const message = req.session.message || '';

    res.render('./account/account-management', {
      title: 'Account Management',
      nav,
      message,
      first_name,
      last_name,
      email,
      account_type
    });

    // Clear the message after displaying it
    if (req.session) {
      req.session.message = '';
    }
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Build Account Update View
 *************************** */
exports.buildAccountUpdate = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const account_id = req.params.account_id;
    
    // Get account data
    const account = await accountsModel.getAccountById(account_id);
    
    if (!account) {
      return res.status(404).render('errors/error', {
        title: 'Account Not Found',
        message: 'Account not found',
        nav
      });
    }

    res.render('./account/account-update', {
      title: 'Update Account',
      nav,
      account,
      message: res.locals.message || '',
      errors: res.locals.errors || null
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Process Account Update
 *************************** */
exports.updateAccount = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const { account_id, first_name, last_name, email } = req.body;

    // Update the account
    const result = await accountsModel.updateAccount(account_id, first_name, last_name, email);

    if (typeof result === 'string') {
      // Error occurred
      const account = await accountsModel.getAccountById(account_id);
      res.status(400).render('./account/account-update', {
        title: 'Update Account',
        nav,
        account,
        message: 'Failed to update account information',
        errors: ['Unable to update account information']
      });
    } else {
      // Get updated account data
      const updatedAccount = await accountsModel.getAccountById(account_id);
      
      // Update session user data
      req.session.user = {
        account_id: updatedAccount.account_id,
        first_name: updatedAccount.first_name,
        last_name: updatedAccount.last_name,
        email: updatedAccount.email,
        account_type: updatedAccount.account_type
      };

      // Set success message
      req.session.message = 'Account information updated successfully!';

      res.redirect('/account');
    }
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Process Password Change
 *************************** */
exports.updatePassword = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const { account_id, password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    const result = await accountsModel.updatePassword(account_id, hashedPassword);

    if (typeof result === 'string') {
      // Error occurred
      const account = await accountsModel.getAccountById(account_id);
      res.status(400).render('./account/account-update', {
        title: 'Update Account',
        nav,
        account,
        message: 'Failed to update password',
        errors: ['Unable to update password']
      });
    } else {
      // Set success message
      req.session.message = 'Password changed successfully!';

      res.redirect('/account');
    }
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Process Logout
 *************************** */
exports.logout = async (req, res, next) => {
  try {
    // Clear session
    if (req.session) {
      req.session.user = null;
      req.session.message = '';
    }

    // Clear JWT cookie
    res.clearCookie('jwt');

    // Redirect to home
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};
