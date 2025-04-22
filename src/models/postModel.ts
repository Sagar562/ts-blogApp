import { DataTypes, Model } from "sequelize";
import { IPost } from "../interfaces/interfaces";
import { sequelize } from "../config/database";
import { User } from "./userModel";

export interface postInstance extends Model<IPost>, IPost {}

export const Post = sequelize.define<postInstance>('Post', {
    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    postContent: {
        type: DataTypes.TEXT,
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

User.hasMany(Post, {foreignKey: 'userId', onDelete: 'CASCADE'});
Post.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'});

