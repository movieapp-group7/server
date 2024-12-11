import { pool } from '../helpers/db.js'
import { Router } from "express"
import dotenv from 'dotenv';
import { addMovie, getMoviesByStatus,updateMovie,removeMovie, } from '../controllers/UserController.js'


const router = Router()
dotenv.config()

router.post('/watchlist', addMovie); // POST /watchlist (body: accountId, movieId, status)
router.get('/watchlist/:accountId/:status', getMoviesByStatus); // GET /watchlist/:accountId/:status
router.put('/watchlist/:accountId/:movieId', updateMovie); // PUT /watchlist/:accountId/:movieId
router.delete('/watchlist/:accountId/:movieId', removeMovie); // DELETE /watchlist/:accountId/:movieId



export default router;
