import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { sequelize } from "../src/config/database";
import { User } from "../src/models";
import { Umzug, SequelizeStorage } from "umzug";

console.log('DB Config:', {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

console.log(sequelize)


chai.use(chaiHttp);

const baseURL = process.env.TEST_URL || "http://localhost:4000";

describe("User API Tests", () => {
  beforeEach(async () => {
    try {
      const umzug = new Umzug({
        migrations: {
          glob: './migrations/*.js',
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
      });

      await umzug.down({ to: 0 });
      await umzug.up();
      // await User.destroy({ where: {}, truncate: true, cascade: true }); // Clear data
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  });

  after(async () => {
    await sequelize.close();
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
  });

  describe("Query: users", () => {
    it("should fetch all users", async () => {
      // Seed test data
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
});
