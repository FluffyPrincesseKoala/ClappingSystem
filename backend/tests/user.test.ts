import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { sequelize } from "../src/config/database";
import { User } from "../src/models";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";

console.log('DB Config:', {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

chai.use(chaiHttp);

const baseURL = process.env.TEST_URL || "http://localhost:4000";

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.js"), // Ensure correct path
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

describe("User API Tests", () => {
  before(async () => {
    console.log("Ensuring database is ready...");
    await sequelize.sync(); // Ensures database is initialized
    await umzug.up(); // Apply migrations AFTER sync
    console.log("Migrations applied successfully.");
  });

  after(async () => {
    console.log("Resetting test database...");
    await sequelize.close();
  });

  beforeEach(async () => {
    console.log("log the existing tables in beforeEach():", await sequelize.getQueryInterface().showAllTables());
    console.log("Cleaning up tables...");
    await sequelize.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;');
  });

  describe("Mutation: createUser", () => {
    it("should create a new user", async () => {
      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          mutation {
            createUser(name: "John Doe", email: "john.doe@example.com") {
              id
              name
              email
              createdAt
              updatedAt
            }
          }
        `,
      });

      expect(res).to.have.status(200);
      expect(res.body.data.createUser).to.be.an("object");
      expect(res.body.data.createUser.name).to.equal("John Doe");
      expect(res.body.data.createUser.email).to.equal("john.doe@example.com");

      const user = await User.findOne({ where: { email: "john.doe@example.com" } });
      expect(user).to.not.be.null;
      expect(user?.name).to.equal("John Doe");
    });

    it("should fail if email is already in use", async () => {
      await User.create({ name: "John Doe", email: "john.doe@example.com" });

      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          mutation {
            createUser(name: "John Doe", email: "john.doe@example.com") {
              id
            }
          }
        `,
      });

      console.log("GraphQL Response:", res.body);

      expect(res).to.have.status(400); // 500 means your error is not handled in the API
      expect(res.body.errors).to.not.be.undefined;
      expect(res.body.errors[0].message).to.include("already exists");
    });

    it("should fail if required fields are missing", async () => {
      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          mutation {
            createUser {
              id
            }
          }
        `,
      });

      console.log("GraphQL Response for missing fields:", res.body);

      expect(res).to.have.status(400);
      expect(res.body.errors).to.not.be.undefined;
    
      const errorMessages = res.body.errors.map((err: { message: string }) => err.message);
      const expectedMessages = [
        "Field \"createUser\" argument \"name\" of type \"String!\" is required, but it was not provided.",
        "Field \"createUser\" argument \"email\" of type \"String!\" is required, but it was not provided."
      ];
    
      expectedMessages.forEach((msg) => {
        expect(errorMessages).to.include(msg);
      });
    });
  });

  describe("Query: users", () => {
    it("should fetch all users", async () => {
      await User.bulkCreate([
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
      ]);

      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          query {
            users {
              id
              name
              email
            }
          }
        `,
      });

      console.log("GraphQL Response:", res.body);
      expect(res).to.have.status(200);
      expect(res.body.data.users).to.be.an("array").that.has.length(2);
    });

    it("should return an empty array if no users exist", async () => {
      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          query {
            users {
              id
              name
              email
            }
          }
        `,
      });

      console.log("GraphQL Response:", res.body);
      expect(res).to.have.status(200);
      expect(res.body.data.users).to.be.an("array").that.is.empty;
    });
  });

  describe("Query: user(id)", () => {
    it("should return the correct user by ID", async () => {
      const user = await User.create({ name: "Jane Doe", email: "jane.doe@example.com" });

      console.log(`Created user in DB: ID=${user.id}, Name=${user.name}, Email=${user.email}`);

      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: { id: user.id },
      });

      console.log("GraphQL Response:", res.body);

      expect(res).to.have.status(200);
      expect(res.body.errors).to.be.undefined;
      expect(res.body.data.user).to.not.be.null;
      expect(res.body.data.user.name).to.equal("Jane Doe");
    });

    it("should fail if user ID does not exist", async () => {
      const res = await chai.request(baseURL).post("/graphql").send({
        query: `
          query {
            user(id: 99999) {
              id
            }
          }
        `,
      });

      console.log("GraphQL Error Response:", res.body);

      expect(res).to.have.status(200);
      expect(res.body.errors).to.be.undefined;
      expect(res.body.data.user).to.be.null;
    });
  });
});
