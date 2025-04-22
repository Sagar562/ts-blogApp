import express from "express";
import { likePost } from "../controllers/likeController";

const router = express.Router();

// like the post
router.post('/likePost', likePost);

export default router;