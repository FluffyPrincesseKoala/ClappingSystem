import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  CreationOptional,
} from 'sequelize'
import { sequelize } from '../config/database.js'
import { User } from './User.js' // Import the actual model

export class Todo extends Model<
  InferAttributes<Todo>, // All attributes on the model
  InferCreationAttributes<Todo> // Attributes required for creation
> {
  declare id: CreationOptional<number> // Primary key
  declare title: string // Title of the todo

  // Foreign key to User
  declare creatorId: ForeignKey<InstanceType<typeof User>['id']>

  // Timestamps
  declare readonly createdAt: CreationOptional<Date>
  declare readonly updatedAt: CreationOptional<Date>
}

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
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
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
    sequelize,
    modelName: 'Todo',
    tableName: 'todos', // Explicit table name
    timestamps: true, // Enables automatic timestamps
  }
)

// Define associations
Todo.belongsTo(User, { foreignKey: 'creatorId' })
User.hasMany(Todo, { foreignKey: 'creatorId' })

export default Todo
