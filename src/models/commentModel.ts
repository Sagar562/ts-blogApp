import { DataTypes, Model } from "sequelize";
import { IComment } from "../interfaces/interfaces";
import { User } from "./userModel";
import { Post } from "./postModel";
import { sequelize } from "../config/database";

export interface commentInstance extends Model<IComment>, IComment {}

export const Comment = sequelize.define<commentInstance>("Comment", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post, 
            key: 'id',
        },
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,  
            key: 'id',
        },
        allowNull: false,
    },
    commentContent: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

// post relation
Post.hasMany(Comment, {foreignKey: 'postId', onDelete: 'CASCADE'});
Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });

// user relation
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
