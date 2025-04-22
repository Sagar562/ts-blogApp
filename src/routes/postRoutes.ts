import express from "express";
import {createPost, updatePost, getAllPost} from "../controllers/postController";

const router = express.Router();

// create post route
router.post('/createPost', createPost);

// get all post route
router.get('/allPost', getAllPost);

// update post
router.post('/updatePost', updatePost);

export default router;