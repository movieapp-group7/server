import express from 'express'
import cors from 'cors'
import movieRouter from './routers/movieRouter.js'
import userRouter from './routers/userRouter.js'
import groupsRouter from './routers/groupRouter.js'
import watchlistRouter from './routers/watchlistRouter.js'

const port = process.env.PORT 

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//routes
app.use('/movie',movieRouter)
app.use('/user',userRouter)
app.use('/groups', groupsRouter)
app.use('/watch', watchlistRouter)

//test
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});


app.listen(port, () => {
  //test
  console.log(`Server is running on port ${port}`);
});