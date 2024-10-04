import express from "express";
import {
  authenticateToken,
  checkAdmin,
} from "../middlewares/authMiddleware.js";
import { getCourseDepartment, getSkillsDepartments, getUserGrowthOverTime, getUsersByDepartment } from "../controllers/dataController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(checkAdmin);

router.get('/get-user-growth', getUserGrowthOverTime);
router.get('/get-department-users', getUsersByDepartment);
router.get('/get-skills-department', getSkillsDepartments);
router.get('/get-course-department', getCourseDepartment);


export default router;
