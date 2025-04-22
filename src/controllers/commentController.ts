import { Request, Response } from "express";
import { Comment } from "../models/commentModel";
import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import { z } from "zod";

const createPostSchema = z.object({
    userId: z.number(),
    postId: z.number(),
    commentContent: z.string(),
});

const getCommentsSchema = z.object({
    postId: z.number(),
});

type createCommentValidation = z.infer<typeof createPostSchema>;
type getCommentsValidation = z.infer<typeof getCommentsSchema>;

// create comment
export const createComment = async (req: Request<{}, {}, createCommentValidation>, res: Response) => {

    try {

        const commentValidation = createPostSchema.parse(req.body);

        // check for post 
        const post = await Post.findByPk(commentValidation.postId);
        if (!post)
        {
            res.status(404).json({
                success: false,
                message: 'Post not found',
            });
            return;
        }

        // check for user
        const user = await User.findByPk(commentValidation.userId);
        if (!user)
        {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        const newComment = await Comment.create(commentValidation);

        res.status(201).json({
            Comment: newComment,
            success: true,
            message: 'Comment added successfully',
        });

    }catch(error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
};

// get all comments related to post
export const getComments = async (req:Request<{}, {}, getCommentsValidation>, res: Response) => {

    try {
        const {postId} = getCommentsSchema.parse(req.body);   

        //get all comment of one post
        const comments = await Comment.findAll({
            where: { postId: postId},
            attributes: {exclude: ['deletedAt']},
            include: [{
                model: User,
                attributes: ['name'],
            }],
        });

        res.status(200).json({
            comments: comments,
            success: true,
            message: 'Comment fetched successfully',
        });

    }catch(error) {
        if (error instanceof z.ZodError)
        {
            res.status(400).json({
                success: false,
                message: 'validation failed',
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};