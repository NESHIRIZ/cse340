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