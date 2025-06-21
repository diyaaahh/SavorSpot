import express from 'express'
import connectDB from './db/config.js'
import authRoutes from './db/Routes/authRoutes.js'
import cors from 'cors'

const app = express()
const port = 3001
const allowedOrigin = 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(express.json())

connectDB();

app.use('/api/auth', authRoutes);
app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})

