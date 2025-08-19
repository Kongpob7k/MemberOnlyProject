const { pool } = require("../config/db");

async function initializeDatabase() {
  try {
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid varchar PRIMARY KEY,
        sess json NOT NULL,
        expire timestamp(6) NOT NULL
      );
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);`);

    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        password VARCHAR(255) NOT NULL,
        admin INTEGER
      );
    `);

    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        content VARCHAR(500),
        username VARCHAR(50)
      );
    `);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

(async () => {
  await initializeDatabase();
})();