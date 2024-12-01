import { Router } from "express"
import {postNewReview,getReviewsByMovie,getAverageRating,postFavorite,getFavoriteStatus,getFavoritesByUser} from '../controllers/MovieController.js'

const router = Router()

//review section
router.get('/:movieId/reviews', getReviewsByMovie)
// router.get('/reviews', getAllReviews)
router.post('/newreview', postNewReview);
router.get('/:movieId/rating',getAverageRating);

//favorite section
router.post('/favorites', postFavorite);
router.get('/favorites/:accountId/:movieId', getFavoriteStatus);
router.get('/favorites/:accountId', getFavoritesByUser);

export default router;