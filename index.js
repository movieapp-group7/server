import express from 'express'
import cors from 'cors'
import movieRouter from './routers/movieRouter.js'
import userRouter from './routers/userRouter.js'

const port = process.env.PORT 

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/movie',movieRouter)
app.use('/user',userRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});


app.listen(port)