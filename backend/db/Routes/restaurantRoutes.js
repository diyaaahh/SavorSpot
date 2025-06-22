

import express from 'express';
import { addRestaurant, getNearbyRestaurants, getRestaurantById } from '../Controllers/restaurantController.js';
import { verifyAccessToken } from '../Middlewares/authMiddleware.js';
import fileUpload from 'express-fileupload';

const router = express.Router();
router.use(fileUpload({ useTempFiles: true }));

router.post('/add', verifyAccessToken, addRestaurant)
router.get('/nearby', verifyAccessToken, getNearbyRestaurants);
router.get('/:id', getRestaurantById)

export default router;

