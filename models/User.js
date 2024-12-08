import {pool} from '../helpers/db.js'

export const insertUser = async (username, email, password) => {
  return await pool.query('INSERT INTO account (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
}
export const selectUserByEmail = async (email) => {
  return await pool.query('select * from account where email=$1',[email])
}

export const selectReviewsByUser = async (accountId) => {
  return await pool.query('select * from reviews where account_id=$1',[accountId])
}

// share favorite
export const createShareUrl = async (accountId) => {
  const hashedShareUrl = crypto.randomBytes(8).toString('hex'); 
  const shareUrl = `user${accountId}${hashedShareUrl}`;
  return await pool.query(
    `UPDATE account SET share_url = $1 WHERE id = $2 RETURNING share_url`,
    [shareUrl, accountId]
  );
  
};

export const selectShareInfoByUser = async (accountId) => {
  return await pool.query(`SELECT share_url,is_public FROM account WHERE id = $1`, [accountId]);
};
//

export const selectShareInfoByUrl = async (shareUrl) => {
  return await pool.query(
    `SELECT id, email, is_public FROM account WHERE share_url = $1`,
    [shareUrl]
  );
};

export const selectFavoritesByUser = async (accountId) => {
  return await pool.query(
    `SELECT movie_id FROM favorites WHERE account_id = $1`,
    [accountId]
  );
};

export const toggleShareVisibility = async (accountId, isPublic) => {
  return await pool.query(
    `UPDATE account SET is_public = $1 WHERE id = $2`,
    [isPublic, accountId]
  );
};

export const selectAllPublicShares = async () => {
  return await pool.query(
    `SELECT email, share_url FROM account WHERE is_public = true AND share_url IS NOT NULL ORDER BY id`
  );
};



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
