const { pool } = require("../config/db");

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      ) WITH (OIDS=FALSE);
    `);

    await pool.query(`
      ALTER TABLE "session" ADD CONSTRAINT IF NOT EXISTS "session_pkey" PRIMARY KEY ("sid");
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(50),
            "password" VARCHAR(255) NOT NULL,
            "admin" BOOLEAN DEFAULT FALSE
      );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS "post" (
            "id" SERIAL PRIMARY KEY,
            "title" VARCHAR(255),
            "content" VARCHAR(500),
            "username" VARCHAR(50)
        );
    `)

    console.log("Session table initialized");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

module.exports = {
  initializeDatabase
}