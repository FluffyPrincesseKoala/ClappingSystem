# Todo Clapping System

## Overview

The goal is to build a GraphQL API that implements a **todo clapping system**. This system allows users to create todos and clap for other users' todos (similar to an upvote system).

---

## Documentation

### Context

The system serves as a collaboration tool for managing tasks ("todos") and allows users to show appreciation for tasks created by others via a "clapping" mechanism. This interaction mimics an upvote system, encouraging users to create and recognize valuable contributions.

### Technical Questions and Requirements

- **Prevent Self-Clapping**: Ensure that users cannot clap for their own todos.
- **Efficient Clap Counting**: Optimize database queries for aggregating clap totals and user-specific clap counts.
- **Authorization**: Implement rules to restrict clapping to valid users and prevent unauthorized access.
- **Scalability**: Ensure the system can handle a growing number of users, todos, and claps.

### Data Model Specification

#### Models

1. **User**

   - `id: ID!`
   - `name: String!`
   - `email: String!`

2. **Todo**

   - `id: ID!`
   - `title: String!`
   - `creatorId: ID!` (foreign key to `User`)

3. **Clap**
   - `id: ID!`
   - `todoId: ID!` (foreign key to `Todo`)
   - `userId: ID!` (foreign key to `User`)
   - `count: Int!`

### API Specification

#### Queries

1. **Get Todos**

   - Input: `{}`
   - Output:
     ```graphql
     [
       {
         id: ID!
         title: String!
         creator: User!
         totalClaps: Int!
         clapBreakdown: [Clap]
       }
     ]
     ```

2. **Get User Claps**
   - Input: `{ userId: ID! }`
   - Output: Total number of claps given by the user.

#### Mutations

1. **Create Todo**

   - Input: `{ title: String!, creatorId: ID! }`
   - Output: `{ id: ID!, title: String!, creatorId: ID! }`

2. **Clap Todo**
   - Input: `{ todoId: ID!, userId: ID!, count: Int! }`
   - Output: `{ todoId: ID!, totalClaps: Int!, userClaps: Int! }`

### Technology Comparison

1. **GraphQL vs REST**

   - GraphQL allows for querying only the needed data and supports nested relationships efficiently.
   - REST would require multiple endpoints to achieve the same functionality.

2. **Postgres**
   - Chosen for its relational capabilities, ensuring data integrity and supporting complex queries for claps.

---

## Repository Contents

### Code

- Implementation of the GraphQL API using **Node.js** and **TypeScript**.
- Schema definitions, resolvers, and middleware for authentication and validation.

### Unit Tests

- Test coverage for:
  - Mutation logic (e.g., clap validation).
  - Query accuracy (e.g., aggregate clap counts).
  - Permissions and restrictions.

### Docker

- Containers for:
  - Postgres database.
  - GraphQL API.
  - Test runner.

### API Documentation

- Auto-generated using tools like **GraphQL Voyager** or **Postman**.

### Data Model Documentation

- Describes the relationships and constraints between `User`, `Todo`, and `Clap` tables, using tools like **dbdiagram.io**.

### Makefile

- Includes commands to streamline development tasks:
  - Start the server.
  - Run unit tests.
  - Build Docker containers.

---

## Test Cases

### Mutations

1. **Create a Todo:**

   - Input: `{ title: "Fix the bug", userId: 1 }`
   - Expected Result: Todo is created with ID and association to the user.

2. **Clap for a Todo:**

   - Input: `{ todoId: 1, userId: 2, count: 3 }`
   - Expected Result:
     - Clap is added to the todo.
     - Total claps on the todo are updated.

3. **Self-Clap Prevention:**
   - Input: `{ todoId: 1, userId: 1 }`
   - Expected Result: Error response (e.g., "You cannot clap your own todo.").

### Permissions

1. **View Todos:**

   - Input: `{}`
   - Expected Result: A list of todos with their respective claps and creators.

2. **View Clap Breakdown:**
   - Input: `{ todoId: 1 }`
   - Expected Result: Total claps and breakdown by user (e.g., "Martin: 2 claps, Julien: 9 claps").

---

## Bonus Points

- Implement real-time updates using WebSockets or GraphQL subscriptions for claps.
- Write integration tests to ensure the end-to-end flow.
- Add CI/CD scripts to automate testing and deployment.
