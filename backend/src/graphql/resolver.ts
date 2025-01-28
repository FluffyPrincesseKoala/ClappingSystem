import { User, Todo, Clap } from "../models";
console.log("KALALALALALA: INIT RESOLVER 1")
export const resolvers = {
  Query: {
    users: async () => {
      console.log("GraphQL resolver `users` called");
      try {
        const users = await User.findAll();
        console.log("Resolver Users:", users);
        if (!users || !users.length)
          return []
        return users
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
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
        return await User.create({ name, email });
      } catch (error) {
        console.error("Error creating user:", error);
        // if (error.name === "SequelizeUniqueConstraintError") {
        //   throw new Error("Email already exists");
        // }
        throw new Error("Failed to create user");
      }
    },
    createTodo: async (_: any, { title, creatorId }: { title: string; creatorId: number }) => {
      try {
        return await Todo.create({ title, creatorId });
      } catch (error) {
        console.error("Error creating todo:", error);
        throw new Error("Failed to create todo");
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
