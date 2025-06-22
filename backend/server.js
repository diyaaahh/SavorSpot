import express from 'express'
import connectDB from './db/config.js'
import authRoutes from './db/Routes/authRoutes.js'
import restaurantRoutes from './db/Routes/restaurantRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import expressListEndpoints from 'express-list-endpoints';

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
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
console.log(expressListEndpoints(app));

app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})

