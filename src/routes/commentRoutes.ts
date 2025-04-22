import express from "express";
import { createComment, getComments } from "../controllers/commentController";

const router = express.Router();

// create new comment
router.post('/createComment', createComment);

// get comments of one post
router.get('/getComments', getComments);
export default router;