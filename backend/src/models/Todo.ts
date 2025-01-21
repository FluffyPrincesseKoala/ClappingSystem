
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User";

export class Todo extends Model {}

Todo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize, modelName: "Todo" }
);

Todo.belongsTo(User, { foreignKey: "creatorId" });
User.hasMany(Todo, { foreignKey: "creatorId" });
