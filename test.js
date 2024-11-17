import { pool } from './helpers/db.js'; // Adjust path based on your file structure

async function testDatabaseConnection() {
  try {
    // Simple query to test the connection (can be anything simple like 'SELECT NOW()')
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

testDatabaseConnection();
