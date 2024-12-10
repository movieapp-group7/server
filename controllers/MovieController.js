import { insertReview, selectAllReviews, selectReviewsByMovie, selectAverageRatingByMovie,insertFavorite,checkFavorite,deleteFavorite,selectFavoritesByUser} from '../models/Movie.js'

const postNewReview = async (req, res) => {
  const { movieId, accountId, rating, comment } = req.body;
  try {
    if (rating=="" || comment == "") {
      return res.status(400).send("newReview is required");
    }
    const newReview = await insertReview(movieId, accountId, rating, comment);
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

const getAverageRating = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const result = await selectAverageRatingByMovie(movieId);
    res.status(200).json(result.rows);  
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
};

const postFavorite = async (req, res) => {
  const { accountId, movieId, favorite } = req.body;

  try {
    if (favorite) {
      const result = await insertFavorite(accountId, movieId);
      if (result.rows.length > 0) {
        res.status(201).json({ success: true, message: 'Movie added to favorites', data: result.rows[0] });
      } else {
        res.status(409).json({ success: false, message: 'Movie is already in favorites' });
      }
    } else {
      const result = await deleteFavorite(accountId, movieId);
      if (result.rows.length > 0) {
        res.status(200).json({ success: true, message: 'Movie removed from favorites' });
      } else {
        res.status(404).json({ success: false, message: 'Movie not found in favorites' });
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: error.message });
  }
};

const getFavoriteStatus = async (req, res) => {
  const { accountId, movieId } = req.params;

  try {
    const result = await checkFavorite(accountId, movieId);
    res.status(200).json({ isFavorite: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: error.message });
  }
};

const getFavoritesByUser = async (req, res) => {
  const { accountId } = req.params;

  try {
    const result = await selectFavoritesByUser(accountId);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching favorite movies:', error);
    res.status(500).json({ error: error.message });
  }
};


export {postNewReview, getReviewsByMovie,getAllReviews,getAverageRating,postFavorite,getFavoriteStatus,getFavoritesByUser}