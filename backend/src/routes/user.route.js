import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile
);

export default router;
