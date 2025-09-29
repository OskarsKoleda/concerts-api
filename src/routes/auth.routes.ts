import { Router } from "express";

import { authenticateUser, logoutUser } from "../controllers/auth.controller";

const router = Router();

router.post("/login", authenticateUser);
router.post("/logout", logoutUser);

export default router;
