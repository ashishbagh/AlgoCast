import express from "express";
import feedController from "../controllers/feed.js";

const router = express.Router();

router.get("/posts", feedController.getPosts);
router.post("/post", feedController.createposts);
router.post("/send-email", feedController.sendEmail);

export default router;
