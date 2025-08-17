import { Router } from "express";
import { createEvent, getEvents } from "../controllers/event.controller";
import { asyncMiddleware } from "../middleware/async.middleware";
import { upload } from "../middleware/file.middleware";

const router = Router();

router.get("/", asyncMiddleware(getEvents));
router.post(
  "/",
  upload.single("posterImage"),
  asyncMiddleware(createEvent)
);

export default router;
