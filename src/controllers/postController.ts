import { Request, Response } from "express";
import { z } from "zod";
import { Post } from "../models/postModel";
import { User } from "../models/userModel";

// zod schema object
const createPostSchema = z.object({
    userId: z.number(),
    postContent: z.string(),
});

// zod update schema
const updatePostSchema = z.object({
    postId: z.number(),
    postContent: z.string(),
});

// zod delete schema
const deletePostSchema = z.object({
    postId: z.number(),
});

type createPostValidation = z.infer<typeof createPostSchema>;
type updatePostValidation = z.infer<typeof updatePostSchema>;
type deletePostValidation = z.infer<typeof deletePostSchema>;

// create post 
export const createPost = async (req: Request<{}, {}, createPostValidation>, res: Response) => {

    try {
        const postValidation = createPostSchema.parse(req.body);

        const checkUser = await User.findByPk(postValidation.userId);
        if (!checkUser)
        {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        const post = await Post.create(postValidation);

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: post,
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

// update post
export const updatePost = async (req: Request<{}, {}, updatePostValidation>, res: Response) => {

    try {
        const postValidation = updatePostSchema.parse(req.body);
        
        // check for post id 
        const post = await Post.findByPk(postValidation.postId);
        if (!post)
        {
            res.status(404).json({
                success: false,
                message: 'Post is not exists',
            });
            return;
        }

        post.postContent = postValidation.postContent;
        await post.save();

        res.status(200).json({
            updatedPost : post,
            success: true,
            message: 'Post updated successfully',
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

// get all post
export const getAllPost = async (req: Request, res: Response) => {

    try {
        const allPost = await Post.findAll({
            attributes: {exclude: ['deletedAt']},
            include: [{
                model: User,
                attributes: ['name'],
            }]
        });

        res.status(200).json({
            allPost: allPost,
            success: true,
            message: 'All post fetched successfullyy',
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
};

// delete post
export const deletePost = async (req: Request<{}, {}, deletePostValidation>, res: Response) => {

    try {
        // console.log(req.body);
        const postValidation = deletePostSchema.parse(req.body);
        
        const post = await Post.findByPk(postValidation.postId);
        // console.log(post);
        if (!post)
        {
            res.status(404).json({
                success: false,
                message: 'Post not found',
            });
            return;
        }

        const deletedPost = await Post.destroy({
            where: {
                id : postValidation.postId,
            }
        });

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            deletedPost : deletedPost,
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