import { DataTypes, Model } from "sequelize";
import { IUser } from "../interfaces/interfaces";
import { sequelize } from "../config/database";

export interface UserInstance extends Model<IUser>, IUser {}

export const User = sequelize.define<UserInstance>('User', {
    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});