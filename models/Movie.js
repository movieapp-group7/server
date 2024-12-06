import {pool} from '../helpers/db.js'

//review section
export const insertReview = async (movieId, accountId, email, rating,comment) => {
  const time = new Date().toISOString();
  return await pool.query("INSERT INTO reviews (movie_id, account_id, email, rating, comment, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [movieId, accountId, email, rating,comment,time])
}

export const selectReviewsByMovie = async (movieId) => {
  return await pool.query('select * from reviews where movie_id=$1 order by time DESC',[movieId])
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