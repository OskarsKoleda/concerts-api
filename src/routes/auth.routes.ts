import { Router } from "express";

import { authorizeUser } from "../controllers/auth.controller";

const router = Router();

router.post("/", authorizeUser);

export default router;
