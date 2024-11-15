import {pool} from '../helpers/db.js'

export const insertReview = async (movieId, accountId, email, rating,comment) => {
  const time = new Date().toISOString();
  return await pool.query("INSERT INTO reviews (movie_id, account_id, email, rating, comment, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [movieId, accountId, email, rating,comment,time])
}

export const selectReviewsByMovie = async (movie_id) => {
  return await pool.query('select * from reviews where movie_id=$1 order by time DESC',[movie_id])
}

export const selectAllReviews = async () => {
  return await pool.query('select * from reviews')
}

export const selectReviewsByEmail = async (email) => {
  return await pool.query('select * from reviews where email=$1',[email])
}