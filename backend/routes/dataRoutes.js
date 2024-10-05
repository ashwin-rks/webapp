import express from "express";
import {
  authenticateToken,
  checkAdmin,
} from "../middlewares/authMiddleware.js";
import {
  getCourseDepartment,
  getSkillsDepartments,
  getUserCoursesInfo,
  getUserGrowthOverTime,
  getUsersByDepartment,
  getUserSkillsInfo,
} from "../controllers/dataController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(checkAdmin);

router.get("/get-user-growth", getUserGrowthOverTime);
router.get("/get-department-users", getUsersByDepartment);
router.get("/get-skills-department", getSkillsDepartments);
router.get("/get-course-department", getCourseDepartment);
router.get("/get-courses/:userId", getUserCoursesInfo);
router.get('/get-user-skills/:userId', getUserSkillsInfo);

export default router;
