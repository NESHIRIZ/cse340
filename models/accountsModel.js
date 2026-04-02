const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

/* *****************************
 * Register new account
 *************************** */
exports.registerAccount = async (first_name, last_name, email, password) => {
  try {
    // Password should already be hashed by the controller
    const sql = 
      'INSERT INTO account (first_name, last_name, email, password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    
    const result = await pool.query(sql, [first_name, last_name, email, password, 'Client']);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Get account by email
 *************************** */
exports.getAccountByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Get account by ID
 *************************** */
exports.getAccountById = async (account_id) => {
  try {
    const result = await pool.query('SELECT * FROM account WHERE account_id = $1', [account_id]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Update account information
 *************************** */
exports.updateAccount = async (account_id, first_name, last_name, email) => {
  try {
    const sql = 
      'UPDATE account SET first_name = $1, last_name = $2, email = $3 WHERE account_id = $4 RETURNING *';
    
    const result = await pool.query(sql, [first_name, last_name, email, account_id]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Update password
 *************************** */
exports.updatePassword = async (account_id, hashedPassword) => {
  try {
    const sql = 
      'UPDATE account SET password = $1 WHERE account_id = $2 RETURNING *';
    
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 * Check if email exists (for validation)
 *************************** */
exports.emailExists = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    return result.rows.length > 0;
  } catch (error) {
    return false;
  }
};

/* *****************************
 * Check if email exists but exclude a specific account (for update validation)
 *************************** */
exports.emailExistsExcept = async (email, account_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE email = $1 AND account_id != $2',
      [email, account_id]
    );
    return result.rows.length > 0;
  } catch (error) {
    return false;
  }
};
