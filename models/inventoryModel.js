const db = require('../database/connection'); // adjust if your DB connection is elsewhere

exports.getVehicleById = async (id) => {
  try {
    const query = 'SELECT * FROM vehicles WHERE id = ?';
    const [rows] = await db.execute(query, [id]); // Prepared statement
    return rows[0]; // return first row (or undefined if not found)
  } catch (error) {
    throw error;
  }
};