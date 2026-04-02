const accountsModel = require('../models/accountsModel');
const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* *****************************
 * Build Login View
 *************************** */
exports.buildLogin = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    res.render('./account/login', {
      title: 'Login',
      nav,
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Build Registration View
 *************************** */
exports.buildRegister = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    res.render('./account/register', {
      title: 'Register',
      nav,
      errors: null,
      first_name: '',
      last_name: '',
      email: '',
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Register Account
 *************************** */
exports.registerAccount = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const { first_name, last_name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingAccount = await accountsModel.getAccountByEmail(email);
    if (existingAccount) {
      req.flash('error', 'Email already registered. Please login or use a different email.');
      return res.status(400).render('./account/register', {
        title: 'Register',
        nav,
        errors: ['Email already registered'],
        first_name,
        last_name,
        email,
        messages: req.flash()
      });
    }

    // Register the new account
    const result = await accountsModel.registerAccount(first_name, last_name, email, hashedPassword);

    if (!result) {
      req.flash('error', 'Registration failed. Please try again.');
      return res.status(400).render('./account/register', {
        title: 'Register',
        nav,
        errors: ['Registration failed'],
        first_name,
        last_name,
        email,
        messages: req.flash()
      });
    }

    req.flash('notice', 'Registration successful! Please login.');
    res.redirect('/account/login');
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Account Login
 *************************** */
exports.accountLogin = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const { email, password } = req.body;

    // Get account by email
    const account = await accountsModel.getAccountByEmail(email);

    if (!account) {
      req.flash('error', 'Invalid email or password.');
      return res.status(401).render('./account/login', {
        title: 'Login',
        nav,
        errors: ['Invalid email or password'],
        email,
        messages: req.flash()
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, account.password);

    if (!passwordMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.status(401).render('./account/login', {
        title: 'Login',
        nav,
        errors: ['Invalid email or password'],
        email,
        messages: req.flash()
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { account_id: account.account_id, email: account.email },
      process.env.ACCESS_TOKEN_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Set session
    req.session.user = {
      account_id: account.account_id,
      first_name: account.first_name,
      last_name: account.last_name,
      email: account.email,
      account_type: account.account_type
    };

    req.flash('notice', 'You have successfully logged in!');
    res.redirect('/account');
  } catch (error) {
    next(error);
  }
};

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
      account_id,
      first_name,
      last_name,
      email,
      account_type,
      messages: req.flash()
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
 * Build Account Reviews View
 *************************** */
exports.buildAccountReviews = async (req, res, next) => {
  try {
    const nav = res.locals.nav;
    const accountId = req.session.user.account_id;
    const reviews = await inventoryModel.getReviewsByAccountId(accountId);

    res.render('./account/account-reviews', {
      title: 'My Reviews',
      nav,
      reviews,
      messages: req.flash()
    });
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
      errors: res.locals.errors || null,
      messages: req.flash()
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
