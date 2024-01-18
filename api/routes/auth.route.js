import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup) //This signup function(in blue) - coming from auth.controller.

export default router;