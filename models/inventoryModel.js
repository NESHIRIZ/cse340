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
exports.getVehiclesByClassification = async (classification_id, minRating = 0) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.classification_name,
        COALESCE(ROUND(AVG(vr.rating)::numeric, 1), 0) AS avg_rating,
        COUNT(vr.review_id) AS review_count
       FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       LEFT JOIN public.vehicle_review AS vr
         ON i.inventory_id = vr.inventory_id
       WHERE i.classification_id = $1
       GROUP BY i.inventory_id, c.classification_name
       HAVING COALESCE(AVG(vr.rating), 0) >= $2
       ORDER BY avg_rating DESC, i.inv_make ASC`,
      [classification_id, minRating]
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
 *  Get top rated vehicles (min 1 review)
 * ************************** */
exports.getTopRatedVehicles = async (limit = 5) => {
  try {
    const result = await pool.query(
      `SELECT i.inventory_id, i.inv_make, i.inv_model, i.inv_thumbnail, i.inv_price,
        COALESCE(ROUND(AVG(vr.rating)::numeric, 1), 0) AS avg_rating,
        COUNT(vr.review_id) AS review_count
       FROM public.inventory i
       LEFT JOIN public.vehicle_review vr
         ON i.inventory_id = vr.inventory_id
       GROUP BY i.inventory_id
       HAVING COUNT(vr.review_id) > 0
       ORDER BY avg_rating DESC, review_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ***************************
 *  Get reviews by account_id
 * ************************** */
exports.getReviewsByAccountId = async (account_id) => {
  try {
    const result = await pool.query(
      `SELECT vr.review_id, vr.review_text, vr.rating, vr.created_at,
              i.inventory_id, i.inv_make, i.inv_model
       FROM public.vehicle_review vr
       JOIN public.inventory i ON vr.inventory_id = i.inventory_id
       WHERE vr.account_id = $1
       ORDER BY vr.created_at DESC`,
      [account_id]
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ***************************
 *  Add custom request
 * ************************** */
exports.addCustomRequest = async (account_id, preferred_make, preferred_model, desired_features, budget, additional_notes) => {
  try {
    const result = await pool.query(
      `INSERT INTO public.custom_request (account_id, preferred_make, preferred_model, desired_features, budget, additional_notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [account_id, preferred_make, preferred_model, desired_features, budget, additional_notes]
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