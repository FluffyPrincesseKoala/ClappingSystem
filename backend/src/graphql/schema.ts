import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolver";

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Todo {
    id: ID!
    title: String!
    creator: User!
    totalClaps: Int!
  }

  type Clap {
    id: ID!
    count: Int!
    user: User!
    todo: Todo!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    createTodo(title: String!, creatorId: ID!): Todo!
    clapTodo(todoId: ID!, userId: ID!, count: Int!): Clap!
  }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });
