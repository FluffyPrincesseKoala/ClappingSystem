# Dockerfile for Running the Todo Clapping System

## Step 1: Create a Dockerfile

Create a file named `Dockerfile` in your project root with the following content:

```dockerfile
# Use the official Node.js LTS image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Expose the application's port
EXPOSE 4000

# Command to start the application
CMD ["npm", "start"]
```

---

## Step 2: Add a "Ready" Route to the App

Update your Express app to include a `/ready` route for health checks.

#### Example `src/index.js` (or `src/app.js`)

```javascript
const express = require("express")
const app = express()

app.use(express.json())

// Health check route
app.get("/ready", (req, res) => {
    res.status(200).json({ message: "App is ready!" })
})

app.get("/", (req, res) => {
    res.send("Hello World")
})

// Start the server
const PORT = process.env.PORT || 4000
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

module.exports = app
```

---

## Step 3: Create a Test Request for the "Ready" Route

You can use tools like `curl` or Postman to send a request to the `/ready` route once the Docker container is running.

### Example Test Using `curl`

```bash
curl http://localhost:4000/ready
```

Expected Response:

```json
{
    "message": "App is ready!"
}
```

---

## Step 4: Build and Run the Docker Image

1. Build the Docker image:

    ```bash
    docker build -t todo-app .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 4000:4000 todo-app
    ```

3. Test the app's readiness by sending a request to the `/ready` endpoint:
    ```bash
    curl http://localhost:4000/ready
    ```

---

This setup ensures that the app is ready to handle requests and can be easily containerized and tested. Let me know if you need further adjustments!
