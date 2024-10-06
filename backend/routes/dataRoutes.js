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
import { getAvgMarksCourses, getDepartmentUsers, getSkillUserCounts } from "../controllers/departmentController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(checkAdmin);

// Admin Dashboard
router.get("/get-user-growth", getUserGrowthOverTime);
router.get("/get-department-users", getUsersByDepartment);
router.get("/get-skills-department", getSkillsDepartments);
router.get("/get-course-department", getCourseDepartment);

// user profile views
router.get("/get-courses/:userId", getUserCoursesInfo);
router.get('/get-user-skills/:userId', getUserSkillsInfo);

// department Views
router.get('/get-department-users/:deptId', getDepartmentUsers);
router.get('/get-avgmarks-courses/:deptId', getAvgMarksCourses);
router.get('/get-user-skill-dept/:deptId', getSkillUserCounts);

export default router;
