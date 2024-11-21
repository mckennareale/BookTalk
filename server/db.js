const { Pool, types } = require('pg');
require('dotenv').config();

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS


const connection = new Pool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = connection;
