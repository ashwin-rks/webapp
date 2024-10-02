import express from "express";
import {
  addDepartment,
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

export default router;
