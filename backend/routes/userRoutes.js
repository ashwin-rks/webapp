import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  changePassword,
  editUserInfo,
  getUserInfo,
} from "../controllers/profileController.js";

const router = express.Router();

router.use(authenticateToken);

// profile
router.get("/get-user-info", getUserInfo);
router.patch("/edit-user-info", editUserInfo);
router.patch("/change-password", changePassword);

export default router;