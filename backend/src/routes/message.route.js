import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMessagesBetweenUsers,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/messages.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/users", authMiddleware, getUsersForSidebar);
router.get("/:id", authMiddleware, getMessagesBetweenUsers);
router.post("/send/:id", authMiddleware, upload.single("image"), sendMessage);

export default router;
