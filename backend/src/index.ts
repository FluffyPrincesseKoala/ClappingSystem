import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";
import { connectToDatabase } from "./config/database";
import { resolvers } from "./graphql/resolver";

console.log("App Schema:", schema);
console.log("App Resolvers:", resolvers);

const app = express();

app.use((req, res, next) => {
  if (req.path === "/graphql") {
    console.log("Received request at /graphql");
  }
  next();
});

// Enhanced Database Connection with Logs
connectToDatabase()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit if the database connection fails
  });

console.log('KALALALALA: GraphQL schema initialization started')

// Middleware for GraphQL with Enhanced Logging
app.use(
  "/graphql",
  graphqlHTTP((req, res) => {
    console.log("KALALALALA: Handling GraphQL request");
    return {
      schema,
      rootValue: resolvers,
      graphiql: true,
      customFormatErrorFn: (err) => {
        console.error("GraphQL Error:", err);
        // console.error("Message:", err.message);
        // console.error("Location:", err.locations);
        // console.error("Path:", err.path);
        return err;
      },
    }
  })
);
console.log("KALALALALA: GraphQL schema initialization finished");

// Health check route
app.get("/ready", (req, res) => {
  console.log("Health check: /ready endpoint hit.");
  res.status(200).json({ message: "App is ready!" });
});

// // Catch-All Error Handler for Express
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ message: "Internal server error" });
// });

// app.use((req, res, next) => {
//     if (req.path === "/graphql") {
//       console.log("GraphQL Request:", req.body);
//     }
//     next();
//   });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
