import { GraphQLError } from 'graphql'
import { models } from '../models/index.js'
import { extensions } from 'sequelize/lib/utils/validator-extras'

const { User, Todo, Clap } = models

export const resolvers = {
  Query: {
    users: async () => {
      console.log('Fetching all users...')
      try {
        const users = await User.findAll()
        return users || []
      } catch (error) {
        console.error('Error fetching users:', error)

        if (error instanceof GraphQLError) {
          throw error
        }

        throw new GraphQLError('Failed to fetch users', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 },
        })
      }
    },

    user: async (_: any, { id }: { id: number }) => {
      console.log(`Fetching user with ID: ${id}`)
      try {
        const user = await User.findByPk(id)
        if (!user) {
          throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND', statusCode: 404 },
          })
        }
        return { ...user.get(), id: user.id } // Ensure ID is present
      } catch (error) {
        console.error('Error fetching user:', error)

        if (error instanceof GraphQLError) {
          throw error
        }

        throw new GraphQLError('Failed to fetch user', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 },
        })
      }
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { name, email }: { name: string; email: string }
    ) => {
      try {
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
          throw new GraphQLError('Email already exists', {
            extensions: { code: 'BAD_USER_INPUT', statusCode: 400 },
          })
        }
        return await User.create({ name, email })
      } catch (error) {
        console.error('Error creating user:', error)

        if (error instanceof GraphQLError) {
          throw error
        }

        throw new GraphQLError('Failed to create user', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 },
        })
      }
    },

    createTodo: async (
      _: any,
      { title, creatorId }: { title: string; creatorId: number }
    ) => {
      try {
        const creator = await User.findByPk(creatorId)
        if (!creator) {
          throw new GraphQLError('Todo creator not found',  {
            extensions: { statusCode: 400, message: `user not found with id: ${creatorId}` },
          })
        }
        return await Todo.create({ title, creatorId })
      } catch (error) {
        console.error('Error creating todo:', error)

        if (error instanceof GraphQLError) {
          if ( error.name === 'SequelizeForeignKeyConstraintError' ) {
            // Return 400
            throw new GraphQLError('Failed to create todo', {
              extensions: { statusCode: 400 },
            })
          }
          throw error
        }

        throw new GraphQLError('Failed to create todo', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 },
        })
      }
    },

    clapTodo: async (
      _: any,
      {
        todoId,
        userId,
        count,
      }: { todoId: number; userId: number; count: number }
    ) => {
      try {
        const existingClap = await Clap.findOne({ where: { todoId, userId } })

        if (existingClap) {
          console.log('yesay')
          existingClap.count += count
          await existingClap.save()
          return existingClap
        } else {
          const existingTodo = await Todo.findByPk(todoId)
          if (!existingTodo) {
            throw new GraphQLError('Failed to find clap relation', {
              extensions: {
                statusCode: 400,
                message: `cannot find todo with id: ${todoId}`
              },
            })
          }
        }

        return await Clap.create({ todoId, userId, count })
      } catch (error) {
        console.error('Error in clapTodo:', error)

        if (error instanceof GraphQLError) {
          if ( error.name === 'SequelizeForeignKeyConstraintError' ) {
            // Return 400
            throw new GraphQLError('Failed to find clap relation', {
              extensions: { statusCode: 400 },
            })
          }
          throw error
        }

        throw new GraphQLError('Failed to clap on todo', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 },
        })
      }
    },
  },

  User: {
    todos: async (user: InstanceType<typeof User>) =>
      await Todo.findAll({ where: { creatorId: user.id } }),
    claps: async (user: InstanceType<typeof User>) =>
      await Clap.findAll({ where: { userId: user.id } }),
  },

  Todo: {
    creator: async (todo: InstanceType<typeof Todo>) =>
      await User.findByPk(todo.creatorId),
    claps: async (todo: InstanceType<typeof Todo>) =>
      await Clap.findAll({ where: { todoId: todo.id } }),
  },

  Clap: {
    user: async (clap: InstanceType<typeof Clap>) =>
      await User.findByPk(clap.userId),
    todo: async (clap: InstanceType<typeof Clap>) =>
      await Todo.findByPk(clap.todoId),
  },
}
