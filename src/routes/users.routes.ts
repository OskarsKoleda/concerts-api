import { Router } from "express";

import {
  getUser,
  getUserStats,
  registerUser,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", registerUser);
router.get("/me", auth, getUser);
router.get("/me/stats", auth, getUserStats);

export default router;
