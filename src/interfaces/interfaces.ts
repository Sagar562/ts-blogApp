//  user interface
export interface IUser {
    id?: number;
    name: string;
    email: string;
    age?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// post interface
export interface IPost {
    id?: number;
    postContent: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;

}

// like interface
export interface ILike {
    id?: number;
    postId: number;
    userId: number;
    createdAt?: Date;
}

// comment interface
export interface IComment {
    id?: number;
    postId: number;
    userId: number;
    commentContent: string;
    createdAt?: Date;
    updatedAt?: Date;
}