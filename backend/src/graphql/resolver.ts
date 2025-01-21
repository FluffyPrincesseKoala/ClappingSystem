import { Todo } from "../models/Todo";
import { User } from "../models/User";
import { Clap } from "../models/Clap";

export const resolvers = {
    Query: {
        todos: async () => {
            const todos = await Todo.findAll({ include: [User, Clap] });
            return todos;
        },
    },
    Mutation: {
        createTodo: async (_: any, { title, creatorId }: any) => {
            return await Todo.create({ title, creatorId });
        },
        clapTodo: async (_: any, { todoId, userId, count }: any) => {
            return await Clap.create({ todoId, userId, count });
        },
    },
};
