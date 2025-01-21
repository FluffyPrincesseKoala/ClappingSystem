import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(
    process.env.DB_NAME || "",
    process.env.DB_USER || "",
    process.env.DB_PASS || "",
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: 'postgres'
    }
);

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log("Database connected successfully!")
    } catch (err) {
        console.error("Unable to connect to the database:", err)
    }
};
