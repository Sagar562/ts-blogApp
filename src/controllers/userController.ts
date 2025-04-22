import { User } from "../models/userModel";
import { Request, Response } from "express";
import { z } from "zod";
 
const addUserSchema = z.object({
    name: z.string().min(2,"name must have two characters"),
    email: z.string().email("Invalid email formate"),
    age: z.number().nullable()
});

const updateUserSchema = z.object({
    userId: z.number(),
    name: z.string().min(2,"name must have two characters").optional(),
    email: z.string().email("Invalid email formate").optional(),
    age: z.number().nullable().optional()
})

type addUserValidation = z.infer<typeof addUserSchema>;
type updateUserValidation = z.infer<typeof updateUserSchema>;

// add users
export const addUser = async (req: Request<{} ,{}, addUserValidation>, res: Response) => {

    try {
        const newUser = addUserSchema.parse(req.body);

        const checkUser = await User.findOne({
            where: {
                email: newUser.email
            }
        });
        
        if (checkUser)
        {
            res.status(401).json({
                success: false,
                message: 'Email already present'
            })
            return;
        }

        // add user in database
        await User.create(newUser);

        res.status(201).json({
            user: newUser,
            success: true,
            message: 'User signUp successfully',
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

        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
};

// update user data
export const updateUser = async (req: Request<{}, {}, updateUserValidation>, res: Response) => {

    try {
        const validateUser = updateUserSchema.parse(req.body);

        // check for user exitsts
        const user = await User.findByPk(validateUser.userId);
        if (!user)
        {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        user.name = validateUser.name ? validateUser.name : user.name;
        user.email = validateUser.email ? validateUser.email : user.email;
        user.age = validateUser.age ? validateUser.age : user.age;

        // update user
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            updateUser : user,
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

        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }

};

// get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        
        const users = await User.findAll({});

        res.status(200).json({
            users: users,
            success: true,
            message: "All users",
        });

    }catch(error) {
        res.status(500).json({
            success: false,
            message: "Error while fetching users",
        });
    }
};