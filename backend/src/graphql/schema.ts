import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from './resolver.js'

export const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
    todos: [Todo!]! # A user can have multiple todos
    claps: [Clap!]! # A user can give multiple claps
    createdAt: String!
    updatedAt: String!
  }

  type Todo {
    id: ID!
    title: String!
    creatorId: ID! # ID of the user who created the todo
    creator: User! # The user who created the todo
    claps: [Clap!]! # A todo can have multiple claps
    createdAt: String!
    updatedAt: String!
  }

  type Clap {
    id: ID!
    count: Int!
    user: User! # The user who clapped
    userId: ID!   # add these
    todo: Todo! # The todo that received the clap
    todoId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]! # Fetch all users
    user(id: ID!): User # Fetch a specific user by ID
    todos: [Todo!]! # Fetch all todos
    todo(id: ID!): Todo # Fetch a specific todo by ID
    claps: [Clap!]! # ADD THIS to fetch all claps
  }

  type Mutation {
    createUser(name: String!, email: String!): User! # Create a new user
    createTodo(title: String!, creatorId: ID!): Todo! # Create a new todo
    clapTodo(todoId: ID!, userId: ID!, count: Int!): Clap! # Add claps to a todo
  }
`

export const schema = makeExecutableSchema({
  typeDefs, // Your type definitions
  resolvers,
})
