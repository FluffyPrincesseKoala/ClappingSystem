1️⃣ User API Tests
✅ Mutation: createUser

Should successfully create a user
Should fail if email is already in use
Should fail if required fields are missing
✅ Query: users

Should fetch all users
Should return an empty array if no users exist
✅ Query: user(id)

Should return the correct user by ID
Should fail if user ID does not exist
2️⃣ Todo API Tests
✅ Mutation: createTodo

Should create a new todo
Should fail if required fields are missing
Should fail if the user ID does not exist
✅ Mutation: updateTodo(id)

Should update a todo
Should fail if the todo does not exist
Should fail if trying to update with invalid data
✅ Mutation: deleteTodo(id)

Should delete a todo
Should fail if the todo does not exist
✅ Query: todos

Should fetch all todos
Should return an empty array if no todos exist
✅ Query: todo(id)

Should return the correct todo by ID
Should fail if todo ID does not exist
3️⃣ Clap API Tests
✅ Mutation: clapTodo(todoId, userId)

Should add a clap to a todo
Should fail if the todo ID does not exist
Should fail if the user ID does not exist
Should prevent duplicate claps from the same user
✅ Query: claps

Should fetch all claps
Should return an empty array if no claps exist
✅ Query: clap(id)

Should return the correct clap by ID
Should fail if clap ID does not exist
4️⃣ Authentication Tests (if applicable)
✅ Mutation: login(email, password)

Should return a valid JWT token
Should fail if credentials are incorrect
Should fail if user does not exist
✅ Middleware: Auth Protection

Should allow access to protected routes with a valid token
Should deny access with an invalid token
Should deny access without a token
5️⃣ Database Integrity & Edge Cases
✅ Foreign Key Constraints

Should delete todos when user is deleted
Should delete claps when todo is deleted
✅ Data Validation

Should prevent saving invalid email formats
Should prevent negative numbers where not allowed
✅ Performance

Should handle bulk inserts efficiently
Should handle concurrent requests properly
6️⃣ Load & Stress Testing (Optional but Cool)
✅ Simulate 100+ users clapping on a todo
✅ Simulate 1000+ todos created in a batch
✅ Test API response time under heavy load
