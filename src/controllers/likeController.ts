import { Request, Response } from "express";
import { Like } from "../models/likeModels";
import { z } from "zod";

// like post schema
const likePostSchema = z.object({
    postId: z.number(),
    userId: z.number(),
});

type likePostValidation = z.infer<typeof likePostSchema>;

export const likePost = async (req: Request<{}, {}, likePostValidation>, res: Response) => {

    try {
        const {userId, postId} = likePostSchema.parse(req.body);

        const existingLike = await Like.findOne({
            where : {userId: userId, postId: postId},
        });

        if (existingLike)
        {
            // dislike the post
            await Like.destroy({
                where: {
                    userId: userId,
                    postId: postId,
                }
            });   
            res.status(200).json({
                success: true,
                message: 'Post unlike successfully',
            });
            return;
        }
        else
        {
            // like the post
            await Like.create({userId: userId, postId: postId});
            res.status(200).json({
                success: true,
                message: 'Post liked successfully',
            });
            return;
        }

    }catch(error) {
        if (error instanceof z.ZodError)
        {
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
        });
    }
};