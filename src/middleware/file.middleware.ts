import multer from "multer";
import { AppError } from "../utils/AppError";

// Middleware for handling file uploads using multer
export const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(new AppError("Only JPG/PNG allowed", 400));
    }

    cb(null, true);
  },
  storage: multer.memoryStorage(),
});
