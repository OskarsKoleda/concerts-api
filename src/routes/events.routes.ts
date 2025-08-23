import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
} from "../controllers/event.controller";
import { asyncMiddleware } from "../middleware/async.middleware";
import { upload } from "../middleware/file.middleware";

const router = Router();

router.get("/", asyncMiddleware(getEvents));
router.post("/", upload.single("posterImage"), asyncMiddleware(createEvent));
router.get("/:slug", asyncMiddleware(getEvent));
router.delete("/:slug", asyncMiddleware(deleteEvent));

export default router;
