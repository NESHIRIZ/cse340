const jwt = require('jsonwebtoken');

/* *****************************
 * Check JWT Token Middleware
 *************************** */
const checkJWTToken = (req, res, next) => {
  // Check for JWT token in cookies
  const token = req.cookies.jwt;

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      
      // Store user data in session and res.locals
      req.session.user = decoded;
      res.locals.user = decoded;
    } catch (error) {
      // Token is invalid or expired, continue without it
      req.session.user = null;
      res.locals.user = null;
    }
  } else {
    req.session.user = null;
    res.locals.user = null;
  }

  next();
};

/* *****************************
 * Require Login Middleware
 *************************** */
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.message = 'You must log in to access this page.';
    return res.redirect('/user/login');
  }
  next();
};

/* *****************************
 * Require Employee/Admin Middleware
 *************************** */
const requireEmployeeOrAdmin = (req, res, next) => {
  if (!req.session.user) {
    req.session.message = 'You must log in to access inventory management.';
    return res.redirect('/user/login');
  }

  if (req.session.user.account_type !== 'Employee' && req.session.user.account_type !== 'Admin') {
    req.session.message = 'You do not have permission to access inventory management.';
    return res.redirect('/user/login');
  }

  next();
};

module.exports = {
  checkJWTToken,
  requireLogin,
  requireEmployeeOrAdmin
};
