import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/signup', signup); //This signup function(in blue) - coming from auth.controller.
router.post('/signin', signin);
router.post('/google', google);

export default router;