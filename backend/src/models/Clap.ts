import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  CreationOptional,
} from "sequelize"
import { sequelize } from "../config/database"
import { User } from "./User"
import { Todo } from "./Todo"

export class Clap extends Model<
  InferAttributes<Clap>, // All attributes available on the model
  InferCreationAttributes<Clap> // Attributes required for creating an instance
> {
  public id!: CreationOptional<number>
  public count!: number // Number of claps

  // Foreign keys
  public userId!: ForeignKey<User["id"]>
  public todoId!: ForeignKey<Todo["id"]>

  public readonly createdAt!: CreationOptional<Date>;
  public readonly updatedAt!: CreationOptional<Date>;
}

// Initialize the Clap model
Clap.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    todoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Todo,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "Clap",
    tableName: "claps", // Explicit table name
    timestamps: true, // Enable createdAt and updatedAt
  }
)

// Define associations
Clap.belongsTo(User, { foreignKey: "userId" })
Clap.belongsTo(Todo, { foreignKey: "todoId" })
User.hasMany(Clap, { foreignKey: "userId" })
Todo.hasMany(Clap, { foreignKey: "todoId" })

export default Clap
