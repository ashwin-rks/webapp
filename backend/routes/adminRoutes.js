import express from "express";
import {
  addDepartment,
  addSkill,
  editSkill,
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

export default router;
