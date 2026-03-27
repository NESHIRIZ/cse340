const pool = require('../database/connection');

exports.getVehicleById = async (id) => {
  const sql = 'SELECT * FROM inventory WHERE inventory_id = $1';
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};