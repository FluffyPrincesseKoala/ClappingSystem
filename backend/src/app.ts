import express from "express"
import { graphqlHTTP } from "express-graphql"
import { schema } from "./graphql/schema"
import { connectToDatabase } from "./config/database"

const app = express()

connectToDatabase()

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }))

// Health check route
app.get("/ready", (req, res) => {
    res.status(200).json({ message: "App is ready!" })
})

// export for testing app
module.exports = app
