import { Router } from "express";
import { createEvent } from "../controllers/event.controller";
import { asyncMiddleware } from "../middleware/async.middleware";

const router = Router();

router.post("/", asyncMiddleware(createEvent));

export default router;
