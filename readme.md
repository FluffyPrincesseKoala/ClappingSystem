# Todo Clapping System

## Overview

This project is a GraphQL API that allows users to create todos and clap for other users' todos, similar to an upvote system.

---

## Recent Updates

### Fixes and Improvements
- **Fixed Validation Error in Clap API Tests**: Resolved an issue where a `beforeEach` hook failed due to database constraints.
- **Updated `findOrCreate` Usage**: Ensured correct handling of tuple return values to avoid `Property 'id' does not exist` errors.
- **Database Setup Fixes**: Adjusted test setup to properly insert users and todos before running clap tests.

### Testing Enhancements
- **Improved Unit Tests**: Added checks to validate database constraints and prevent invalid claps.
- **Self-Clap Prevention**: Ensured users cannot clap for their own todos.
- **Enhanced Logging**: Improved error messages and logging for better debugging.

---

## Setup and Usage

```sh
docker-compose up --build
```

### Running Tests
```sh
npx cross-env NODE_OPTIONS=--loader=ts-node/esm mocha --timeout 5000 --file ./test-setup.ts --recursive tests/**/*.test.ts
```
or
```sh
npm run test
```

### Debugging Tips
- Use `node --trace-warnings` to track down deprecation warnings.
- Ensure database migrations are correctly applied before running tests.
- Use `findOrCreate` properly to avoid tuple handling issues in TypeScript.

---

## Next Steps
- Optimize database queries for better clap aggregation.
- Implement real-time updates using WebSockets or GraphQL subscriptions.
- Automate testing and deployment with CI/CD.