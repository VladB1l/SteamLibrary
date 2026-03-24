import express from 'express';
import { getSteamProfile } from '../controllers/authController.js';

const router = express.Router();
router.post('/profile', getSteamProfile);

export default router;
