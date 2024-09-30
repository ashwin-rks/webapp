import express from "express";
import { login, signup, validate } from '../controllers/authController.js'; 
import { authenticateToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/validate', authenticateToken, validate);

export default router;
