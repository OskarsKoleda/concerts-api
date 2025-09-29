import { Router } from "express";

import { getUser, registerUser } from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", registerUser);
router.get("/me", auth, getUser);

export default router;
