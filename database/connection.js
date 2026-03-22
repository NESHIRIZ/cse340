const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "cse340",
  user: process.env.PGUSER || "your_pg_username",
  password: process.env.PGPASSWORD || "your_pg_password",
  port: process.env.PGPORT || 5432,
});

module.exports = pool;