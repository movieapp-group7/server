import {pool} from '../helpers/db.js'
import crypto from 'crypto';

export const insertUser = async (username, email, password) => {
  return await pool.query('INSERT INTO account (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
}

export const selectUserByEmail = async (email) => {
  return await pool.query('select * from account where email=$1',[email])
}

export const selectUserById = async (id) =>{
  return await pool.query('select * from account where id=$1',[id])
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


export const deleteUserById = async (id) => {
  return await pool.query('DELETE FROM account WHERE id=$1', [id]); 
};

export const updateUserAvatar = async(fileBuffer, accountId) =>{
  return await pool.query(
    `UPDATE account SET avatar = $1 WHERE id = $2`,
    [fileBuffer, accountId]
  );
}

export const selectAccountAvatarById = async(id) => {
  return await pool.query(
    'SELECT avatar FROM account WHERE id = $1', [id]
  );
}

export const updateAccountInfo = async (username, country,gender,birthday,accountId) => {
  return await pool.query(
    `UPDATE account
     SET username = $1, country = $2, gender=$3,birthday=$4 
     WHERE id = $5`,
    [username, country,gender,birthday,accountId]
  );
};

//watchlist
export const addMovieToWatchlist = async (accountId, movieId, status) => {
  const query = `
    INSERT INTO watchlist (account_id, movie_id, status)
    VALUES ($1, $2, $3)
    ON CONFLICT (account_id, movie_id) DO UPDATE SET status = $3
  `;
  try {
    return await pool.query(query, [accountId, movieId, status]);
  } catch (err) {
    console.error('Database Error:', err); // Log the error
    throw new Error('Failed to add movie to watchlist'); // Ensure this propagates
  }
};

export const getWatchlistByStatus = async (accountId, status) => {
  const query = `SELECT * FROM watchlist WHERE account_id = $1 AND status = $2`;
  const result = await pool.query(query, [accountId, status]);
  return result.rows;
};

export const updateMovieStatus = async (accountId, movieId, status) => {
  const query = `
    UPDATE watchlist 
    SET status = $3 
    WHERE account_id = $1 AND movie_id = $2
  `;
  return await pool.query(query, [accountId, movieId, status]);
};

export const removeMovieFromWatchlist = async (accountId, movieId) => {
  const query = `
    DELETE FROM watchlist 
    WHERE account_id = $1 AND movie_id = $2
  `;
  return await pool.query(query, [accountId, movieId]);
};