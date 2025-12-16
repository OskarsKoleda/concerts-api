import { Router } from "express";
import {
  deleteEvent,
  getEvent,
  getEvents,
  patchEvent,
  postEvent,
  visitEvent,
} from "../controllers/event.controller";
import { asyncMiddleware } from "../middleware/async.middleware";
import { auth } from "../middleware/auth.middleware";
import { upload } from "../middleware/file.middleware";

const router = Router();

router.get("/", asyncMiddleware(getEvents));
router.post(
  "/",
  auth,
  upload.single("posterImage"),
  asyncMiddleware(postEvent)
);

router.get("/:slug", asyncMiddleware(getEvent));
router.delete("/:slug", auth, asyncMiddleware(deleteEvent));
router.patch(
  "/:slug",
  auth,
  upload.single("posterImage"),
  asyncMiddleware(patchEvent)
);

router.post("/:slug/visit", auth, asyncMiddleware(visitEvent));

export default router;
