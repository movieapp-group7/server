import { insertReview, selectAllReviews, selectReviewsByMovie } from '../models/Movie.js'

const postNewReview = async (req, res) => {
  const { movieId, accountId, email, rating, comment } = req.body;
  try {
    if (rating=="" || comment == "") {
      return res.status(400).send("newReview is required");
    }
    const newReview = await insertReview(movieId, accountId, email, rating, comment);
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReviewsByMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const result = await selectReviewsByMovie(movieId);
    res.status(200).json(result.rows);  
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const result = await selectAllReviews();
    res.status(200).json(result.rows);  
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
};

export {postNewReview, getReviewsByMovie,getAllReviews}