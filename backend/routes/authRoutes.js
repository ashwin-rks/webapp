import express from "express";
import { login, signup, validate, getAllDepartments } from '../controllers/authController.js'; 
import { authenticateToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/get-departments', getAllDepartments)
router.post('/validate', authenticateToken, validate);

export default router;
