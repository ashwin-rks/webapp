import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  changePassword,
  editUserInfo,
  getUserInfo,
} from "../controllers/profileController.js";
import {
  enrollInCourse,
  getUserCoursesInfo,
} from "../controllers/coursesController.js";
import {
  addSkillForUser,
  getUserSkillsInfo,
  updateUserSkillCompetency,
} from "../controllers/skillsController.js";

const router = express.Router();

router.use(authenticateToken);

// courses
router.get("/get-courses", getUserCoursesInfo);
router.post("/enroll-course", enrollInCourse);

// skill
router.post("/add-user-skill", addSkillForUser);
router.get("/get-user-skills", getUserSkillsInfo);
router.patch("/update-user-competency", updateUserSkillCompetency);

// profile
router.get("/get-user-info", getUserInfo);
router.patch("/edit-user-info", editUserInfo);
router.patch("/change-password", changePassword);

export default router;
