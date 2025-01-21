# Tests for the Todo Clapping System

## Overview
The following tests ensure that the backend for the Todo Clapping System works as expected. Each test verifies key functionality of the GraphQL API, including querying, creating todos, and clapping logic.

---

## Prerequisites
1. Ensure the PostgreSQL database is running (use Docker if needed).
2. Migrate and seed the database.
3. Use a test runner like **Jest** or **Mocha**.
4. Mock the database if necessary for isolated testing.

---

## Tests

### 1. **Test: Fetch Todos**
#### Description
Ensure the API can return a list of todos with the correct structure and data.

#### Query
```graphql
query {
  todos {
    id
    title
    creator {
      id
      name
    }
    totalClaps
  }
}
```

#### Expected Outcome
- The API returns a list of todos with associated creators.
- Each todo includes a valid `id`, `title`, `creator`, and `totalClaps`.

---

### 2. **Test: Create a Todo**
#### Description
Verify that a user can create a new todo.

#### Mutation
```graphql
mutation {
  createTodo(title: "Test Todo", creatorId: 1) {
    id
    title
    creator {
      id
      name
    }
  }
}
```

#### Expected Outcome
- The todo is created successfully.
- The response includes the `id`, `title`, and `creator`.

---

### 3. **Test: Clap for a Todo**
#### Description
Ensure a user can clap for a todo, and claps are counted correctly.

#### Mutation
```graphql
mutation {
  clapTodo(todoId: 1, userId: 2, count: 3) {
    id
    count
    user {
      id
      name
    }
    todo {
      id
      title
    }
  }
}
```

#### Expected Outcome
- Claps are added to the specified todo.
- The total claps are updated.
- The response includes the clap `id`, `count`, `user`, and `todo`.

---

### 4. **Test: Prevent Self-Clapping**
#### Description
Verify that a user cannot clap for their own todo.

#### Mutation
```graphql
mutation {
  clapTodo(todoId: 1, userId: 1, count: 1) {
    id
    count
  }
}
```

#### Expected Outcome
- The API returns an error, e.g., "You cannot clap for your own todo."
- The todo’s clap count remains unchanged.

---

### 5. **Test: Clap Breakdown**
#### Description
Ensure the API returns the breakdown of claps for a specific todo.

#### Query
```graphql
query {
  todos {
    id
    title
    clapBreakdown {
      user {
        id
        name
      }
      count
    }
  }
}
```

#### Expected Outcome
- The API returns the breakdown of claps for each todo.
- Each breakdown includes the `user` and their `count` of claps.

---

### 6. **Test: Fetch a Single Todo**
#### Description
Verify the API can return details of a single todo by ID.

#### Query
```graphql
query {
  todo(id: 1) {
    id
    title
    creator {
      id
      name
    }
    totalClaps
    clapBreakdown {
      user {
        id
        name
      }
      count
    }
  }
}
```

#### Expected Outcome
- The API returns the todo with all its details.
- The response includes `id`, `title`, `creator`, `totalClaps`, and `clapBreakdown`.

---

## Error Cases
### 1. **Invalid Todo ID**
- Query or mutation with a non-existent todo ID should return an error.
- Example: `Todo not found.`

### 2. **Unauthorized Clap**
- If a user tries to clap without proper authorization, the API should return an error.
- Example: `You must be logged in to clap.`

### 3. **Negative Clap Count**
- Prevent negative or zero claps in the mutation.
- Example: `Clap count must be a positive integer.`

---

## Tools and Setup
- **Test Runner**: Use Jest with a setup file to configure the test environment.
- **Mock Database**: Use `sequelize-mock` or similar for unit tests.
- **Integration Tests**: Run against a test database (e.g., using Docker).

---

Run the tests:
```bash
npm test
```
