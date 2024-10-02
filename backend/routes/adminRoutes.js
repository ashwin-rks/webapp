import express from "express";
import {
  addCourse,
  addDepartment,
  addSkill,
  editCourse,
  editSkill,
  getAllCoursesInfo,
  getAllSkillsInfo,
  getDepartmentsWithInfo,
  updateDepartment,
} from "../controllers/adminContoller.js";
import {
  authenticateToken,
  checkAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(checkAdmin);

router.post("/add-department", addDepartment);
router.patch("/update-department", updateDepartment);
router.get("/get-departments", getDepartmentsWithInfo);

// skills
router.post("/add-skill", addSkill);
router.get('/get-skills', getAllSkillsInfo);
router.patch('/edit-skill', editSkill);

// courses
router.post("/add-course", addCourse);
router.get('/get-courses', getAllCoursesInfo);
router.patch('/edit-course', editCourse);

export default router;
