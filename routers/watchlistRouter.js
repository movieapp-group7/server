import { pool } from '../helpers/db.js'
import { Router } from "express"
import dotenv from 'dotenv';
import { addMovie, getMoviesByStatus,updateMovie,removeMovie, } from '../controllers/UserController.js'


const router = Router()
dotenv.config()

router.post('/watchlist', addMovie); 
router.get('/watchlist/:accountId/:status', getMoviesByStatus); 
router.put('/watchlist/:accountId/:movieId', updateMovie); 
router.delete('/watchlist/:accountId/:movieId', removeMovie); 



export default router;