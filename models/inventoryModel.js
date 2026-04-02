const pool = require('../database/connection');

exports.addVehicle = async (...params) => {
  try {
    const result = await pool.query(
      `INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      params
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* ***************************
 *  Get all classification data
 * ************************** */
exports.getClassifications = async () => {
  try {
    const result = await pool.query('SELECT * FROM public.classification ORDER BY classification_name');
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
exports.getVehiclesByClassification = async (classification_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* ***************************
 *  Get vehicle by inventory_id
 * ************************** */
exports.getVehicleById = async (inventory_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inventory_id = $1`,
      [inventory_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* ***************************
 *  Get reviews by vehicle id
 * ************************** */
exports.getReviewsByVehicleId = async (inventory_id) => {
  try {
    const result = await pool.query(
      `SELECT vr.review_id, vr.rating, vr.review_text, vr.created_at,
              a.first_name, a.last_name
       FROM public.vehicle_review vr
       JOIN public.account a ON vr.account_id = a.account_id
       WHERE vr.inventory_id = $1
       ORDER BY vr.created_at DESC`,
      [inventory_id]
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ***************************
 *  Add vehicle review
 * ************************** */
exports.addReview = async (inventory_id, account_id, review_text, rating) => {
  try {
    const result = await pool.query(
      `INSERT INTO public.vehicle_review (inventory_id, account_id, review_text, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [inventory_id, account_id, review_text, rating]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* ***************************
 *  Add new classification
 * ************************** */
exports.addClassification = async (classification_name) => {
  try {
    const result = await pool.query(
      'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *',
      [classification_name]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};   