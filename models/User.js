export const insertUser = async (username, email, hashedPassword) => {
  try {
    const result = await pool.query(
      'INSERT INTO account (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    return result; // returns the inserted user details
  } catch (error) {
    if (error.code === '23505') { // Unique violation error code (for duplicate email)
      throw new Error('Email already in use');
    }
    throw error; // rethrow other database-related errors
  }
};
