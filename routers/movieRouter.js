import { Router } from "express"
import {postNewReview,getReviewsByMovie} from '../controllers/MovieController.js'

const router = Router()

router.get('/reviews/:movieId', getReviewsByMovie)
// router.get('/reviews', getAllReviews)
router.post('/reviews', postNewReview);

export default router;