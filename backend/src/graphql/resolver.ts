import { GraphQLError } from "graphql";
import { User, Todo, Clap } from "../models";

export const resolvers = {
  Query: {
    users: async () => {
      console.log("GraphQL resolver `users` called");
      try {
        const users = await User.findAll();
        if (!users || !users.length)
          return []
        return users
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_: any, { id }: { id: number }) => {
      console.log(`GraphQL resolver \`user(${id})\` called`);
      try {
        const user = await User.findByPk(id);
        if (!user) {
          const error = new GraphQLError(`User with ID ${id} not found`);
          (error as any).extensions = { code: "NOT_FOUND", statusCode: 404 };
          console.log('lol')
          throw error;
        }
        return user;
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        const genericError = new GraphQLError("Failed to fetch user");
        (genericError as any).extensions = { code: "INTERNAL_SERVER_ERROR", statusCode: 500 };
        throw genericError;
      }
    },
    todos: async (user: User) => {
    try {
      const todos = await Todo.findAll({ where: { creatorId: user.id } });
      return todos || []; // Return empty array if no todos
    } catch (error) {
      console.error("Error fetching todos for user:", error);
      return []; // Return fallback value
    }
  },
  claps: async (user: User) => {
    try {
      const claps = await Clap.findAll({ where: { userId: user.id } });
      return claps || [];
    } catch (error) {
      console.error("Error fetching claps for user:", error);
      return []; // Return fallback value
    }
  }
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string; email: string }) => {
      try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          const error = new GraphQLError("Email already exists");
          (error as any).extensions = { code: "BAD_USER_INPUT", statusCode: 400 };
          throw error;
        }
        return await User.create({ name, email });
      } catch (error) {
        console.error("Error creating user:", error);
        const genericError = new GraphQLError("Failed to create user");
        (genericError as any).extensions = { code: "INTERNAL_SERVER_ERROR", statusCode: 500 };
        throw genericError;
      }
    },
    createTodo: async (_: any, { title, creatorId }: { title: string; creatorId: number }) => {
      try {
        return await Todo.create({ title, creatorId });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error creating user:", error.message);

          // Return a GraphQL error with a proper status code
          throw new GraphQLError("Failed to create todo: " + error.message);
        } else {
          console.error("Unexpected error:", error);
          return {
            errors: [{ message: "An unexpected error occurred", statusCode: 500 }],
          };
        }
      }
    },
    clapTodo: async (
      _: any,
      { todoId, userId, count }: { todoId: number; userId: number; count: number }
    ) => {
      try {
        const existingClap = await Clap.findOne({ where: { todoId, userId } });

        if (existingClap) {
          existingClap.count += count;
          await existingClap.save();
          return existingClap;
        }

        return await Clap.create({ todoId, userId, count });
      } catch (error) {
        console.error("Error in clapTodo:", error);
        throw new Error("Failed to clap on todo");
      }
    },
  },
  User: {
    todos: async (user: User) => {
      try {
        const todos = await Todo.findAll({ where: { creatorId: user.id } });
        return todos || []; // Return empty array if no todos
      } catch (error) {
        console.error("Error fetching todos for user:", error);
        return []; // Return fallback value
      }
    },
    claps: async (user: User) => {
      try {
        const claps = await Clap.findAll({ where: { userId: user.id } });
        return claps || [];
      } catch (error) {
        console.error("Error fetching claps for user:", error);
        return []; // Return fallback value
      }
    }
  },
  Todo: {
    creator: async (todo: Todo) => {
      try {
        return await User.findByPk(todo.creatorId);
      } catch (error) {
        console.error("Error fetching creator for todo:", error);
        throw new Error("Failed to fetch creator");
      }
    },
    claps: async (todo: Todo) => {
      try {
        return await Clap.findAll({ where: { todoId: todo.id } });
      } catch (error) {
        console.error("Error fetching claps for todo:", error);
        throw new Error("Failed to fetch claps");
      }
    },
  },
  Clap: {
    user: async (clap: Clap) => {
      try {
        return await User.findByPk(clap.userId);
      } catch (error) {
        console.error("Error fetching user for clap:", error);
        throw new Error("Failed to fetch user");
      }
    },
    todo: async (clap: Clap) => {
      try {
        return await Todo.findByPk(clap.todoId);
      } catch (error) {
        console.error("Error fetching todo for clap:", error);
        throw new Error("Failed to fetch todo");
      }
    },
  },
};
