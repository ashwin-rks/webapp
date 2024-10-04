import express from "express";
import {
  authenticateToken,
  checkAdmin,
} from "../middlewares/authMiddleware.js";
import {
  getDepartmentsWithInfo,
  addDepartment,
  updateDepartment,
} from "../controllers/departmentController.js";
import {
  getAllSkillsInfo,
  addSkill,
  editSkill,
} from "../controllers/skillsController.js";
import {
  getAllCoursesInfo,
  addCourse,
  editCourse,
} from "../controllers/coursesController.js";
import { changePassword, editUserInfo, getUserInfo } from "../controllers/profileController.js";
import { deleteUser, getAllUsersInfo } from "../controllers/employeeController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(checkAdmin);

// department
router.get("/get-departments", getDepartmentsWithInfo);
router.post("/add-department", addDepartment);
router.patch("/update-department", updateDepartment);

// skills
router.get("/get-skills", getAllSkillsInfo);
router.post("/add-skill", addSkill);
router.patch("/edit-skill", editSkill);

// courses
router.get("/get-courses", getAllCoursesInfo);
router.post("/add-course", addCourse);
router.patch("/edit-course", editCourse);

// profile
router.get('/get-user-info', getUserInfo);
router.patch('/edit-user-info', editUserInfo);
router.patch('/change-password', changePassword);

//employee
router.get('/get-users', getAllUsersInfo);
router.delete('/delete-user/:userId', deleteUser);

export default router;
