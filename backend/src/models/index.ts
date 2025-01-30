import { User } from './User.js'
import { Todo } from './Todo.js'
import { Clap } from './Clap.js'

// Export models first
export const models = { User, Todo, Clap }

// Function to setup associations
export const setupAssociations = () => {
  User.hasMany(Todo, { foreignKey: 'creatorId' })
  Todo.belongsTo(User, { foreignKey: 'creatorId' })

  User.hasMany(Clap, { foreignKey: 'userId' })
  Clap.belongsTo(User, { foreignKey: 'userId' })

  Todo.hasMany(Clap, { foreignKey: 'todoId' })
  Clap.belongsTo(Todo, { foreignKey: 'todoId' })
}
