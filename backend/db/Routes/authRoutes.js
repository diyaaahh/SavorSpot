import express from 'express';
import { loginUser, refreshAccessToken, registerUser, updateUserLocation } from '../Controllers/authControllers.js'
import { verifyAccessToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.put('/location', verifyAccessToken, updateUserLocation);
router.post('/refresh', refreshAccessToken)

export default router;