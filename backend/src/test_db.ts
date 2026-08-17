import pool from "./config/database.js";

async function testConnection() {
  try {
    const result = await pool.query("select now() as current_time");
    console.log("Connection successful:", result.rows[0]);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

testConnection();