import express, { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './graphql/schema.js'
import { connectToDatabase } from './config/database.js'
import { resolvers } from './graphql/resolver.js'
import { GraphQLError } from 'graphql/error/GraphQLError.js'

const app = express()

app.use((req, res, next) => {
  if (req.path === '/graphql') {
    console.log('Received request at /graphql')
  }
  next()
})

// Enhanced Database Connection with Logs
connectToDatabase()
  .then(() => {
    console.log('Database connection established successfully.')
  })
  .catch((err) => {
    console.error('Database connection error:', err)
    process.exit(1) // Exit if the database connection fails
  })

// Middleware for GraphQL with Enhanced Logging
app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn: (err: GraphQLError) => {
      console.error('GraphQL Error:', err)

      // Extract status code or default to 500
      const statusCode =
        typeof err.extensions?.statusCode === 'number'
          ? err.extensions.statusCode
          : 500

      res.status(statusCode) // Directly set the HTTP status (reason of this ugly wrapper)

      return {
        message: err.message,
        statusCode,
        extensions: err.extensions,
      }
    },
  })(req, res)
})

// Health check route
app.get('/ready', (req, res) => {
  console.log('Health check: /ready endpoint hit.')
  res.status(200).json({ message: 'App is ready!' })
})

// Middleware to override HTTP status code
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.log('KOALALALALALA')
  if (err.statusCode) {
    res.status(err.statusCode)
  }
  next()
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`)
})
