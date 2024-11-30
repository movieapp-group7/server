import {pool} from '../helpers/db.js'

export const insertUser = async (username,email, hashedPassword) => {
  return await pool.query('INSERT INTO account (username, email, password) VALUES ($1, $2, $3) returning *',
    [username,email,hashedPassword])
}

export const selectUserByEmail = async (email) => {
  return await pool.query('select * from account where email=$1',[email])
}


//.....................................................................................................
//export const deleteUserById = async (id) => {
  //return await pool.query('DELETE FROM account WHERE id=$1', [id]);
//};

const deleteReviewsByAccountId = async (id) => {
  return await pool.query('DELETE FROM reviews WHERE account_id=$1', [id]);
};




export const deleteUserById = async (id) => {

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await deleteReviewsByAccountId(id); 

    const result = await client.query('DELETE FROM account WHERE id=$1', [id]); 
    await client.query('COMMIT');
    return result;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


//...................................................................................................