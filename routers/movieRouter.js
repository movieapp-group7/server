import { Router } from "express"
import {postNewReview,getReviewsByMovie} from '../controllers/MovieController.js'

const router = Router()

router.get('/:movieId/reviews', getReviewsByMovie)
// router.get('/reviews', getAllReviews)
router.post('/newreview', postNewReview);

export default router;