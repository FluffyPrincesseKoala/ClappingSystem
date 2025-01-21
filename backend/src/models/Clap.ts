import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User";
import { Todo } from "./Todo";

export class Clap extends Model { }

Clap.init(
    {
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    { sequelize, modelName: "Clap" }
);

Clap.belongsTo(User, { foreignKey: "userId" });
Clap.belongsTo(Todo, { foreignKey: "todoId" });
User.hasMany(Clap, { foreignKey: "userId" });
Todo.hasMany(Clap, { foreignKey: "todoId" });
