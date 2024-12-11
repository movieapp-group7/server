import {pool} from '../helpers/db.js'

//review section
export const insertReview = async (movieId, accountId, rating,comment) => {
  const time = new Date().toISOString();
  return await pool.query("INSERT INTO reviews (movie_id, account_id, rating, comment, time) VALUES ($1, $2, $3, $4, $5) RETURNING *", [movieId, accountId,  rating,comment,time])
}

export const selectReviewsByMovie = async (movieId) => {
  return await pool.query('select r.*, a.username,a.email from reviews r join account a on r.account_id=a.id where movie_id=$1 order by time DESC',[movieId])
}

export const selectAllReviews = async () => {
  return await pool.query('select * from reviews')
}

// export const selectReviewsByUser = async (account_id) => {
//   return await pool.query('select * from reviews where account_id=$1',[account_id])
// }

export const selectAverageRatingByMovie = async (movie_id) => {
  return await pool.query('select movie_id, ROUND(AVG(rating),1) as averagerating from reviews where movie_id=$1 group by movie_id',[movie_id])
}

//favorite section
export const insertFavorite = async (accountId, movieId) => {
  return await pool.query(
    `INSERT INTO favorites (account_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
    [accountId, movieId]
  );
};

export const deleteFavorite = async (accountId, movieId) => {
  return await pool.query(
    `DELETE FROM favorites WHERE account_id = $1 AND movie_id = $2 RETURNING *`,
    [accountId, movieId]
  );
};

export const checkFavorite = async (accountId, movieId) => {
  return await pool.query(
    `SELECT * FROM favorites WHERE account_id = $1 AND movie_id = $2`,
    [accountId, movieId]
  );
};

export const selectFavoritesByUser = async (accountId) => {
  return await pool.query(
    `SELECT movie_id FROM favorites WHERE account_id = $1`,
    [accountId]
  );
};