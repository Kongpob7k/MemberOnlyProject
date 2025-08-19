const { Pool } = require("pg");
require('dotenv').config();


exports.pool = new Pool({
    connectionString : process.env.DBURL,
})