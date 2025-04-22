import { DataTypes, Model } from "sequelize";
import { ILike } from "../interfaces/interfaces";
import { sequelize } from "../config/database";
import { Post } from "./postModel";
import { User } from "./userModel";

export interface likeInstance extends Model<ILike>, ILike {}

export const Like = sequelize.define<likeInstance>('Like', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,  // Reference to the 'User' model
            key: 'id',
        },
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
});

// relationship
Post.hasMany(Like, {foreignKey: 'postId', onDelete: 'CASCADE'});
Like.belongsTo(Post, {foreignKey: 'postId', onDelete: 'CASCADE'});

User.hasMany(Like, {foreignKey: 'userId', onDelete: 'CASCADE'});
Like.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'});
