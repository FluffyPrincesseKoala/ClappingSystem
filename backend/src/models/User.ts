import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional  } from "sequelize"
import { sequelize } from "../config/database"

export class User extends Model<
  InferAttributes<User>, // Describes the attributes available on the model
  InferCreationAttributes<User> // Describes the attributes required when creating a new instance
> {
  public id!: CreationOptional<number>
  public name!: string
  public email!: string
  public readonly createdAt!: CreationOptional<Date>;
  public readonly updatedAt!: CreationOptional<Date>;
}

User.init(
  {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Default to the current timestamp
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Default to the current timestamp
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "User",
    tableName: "users", // Explicitly specify table name
    timestamps: true // Enables createdAt and updatedAt columns
  }
)

export default User
