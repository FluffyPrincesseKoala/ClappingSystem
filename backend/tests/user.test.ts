import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { sequelize } from "../src/config/database.js";
import { models } from "../src/models/index.js";
const { User } = models
import { Umzug, SequelizeStorage } from "umzug";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

chai.use(chaiHttp);

const baseURL = process.env.TEST_URL || "http://localhost:4100";

const umzug = new Umzug({
  migrations: {
    glob: join(__dirname, "../migrations/*.js"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined, // Silence migration logs
  // logger: console, // debug
});

describe('User API Tests', () => {

  beforeEach(async () => {
    await sequelize.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;')
  })

  describe('Mutation: createUser', () => {
    it('should create a new user', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
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
        })

      expect(res).to.have.status(200)
      expect(res.body.data.createUser).to.be.an('object')
      expect(res.body.data.createUser.name).to.equal('John Doe')
      expect(res.body.data.createUser.email).to.equal('john.doe@example.com')

      const user = await User.findOne({
        where: { email: 'john.doe@example.com' },
      })
      expect(user).to.not.be.null
      expect(user?.name).to.equal('John Doe')
    })

    it('should fail if email is already in use', async () => {
      await User.create({ name: 'John Doe', email: 'john.doe@example.com' })

      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          mutation {
            createUser(name: "John Doe", email: "john.doe@example.com") {
              id
            }
          }
        `,
        })

      // console.log("GraphQL Response:", res.statusCode, res.body);

      expect(res).to.have.status(400)
      expect(res.body.errors).to.not.be.undefined
      expect(res.body.errors[0].message).to.include('Email already exists')
    })
  })

  describe('Query: users', () => {
    it('should fetch all users', async () => {
      await User.bulkCreate([
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
      ])

      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            users {
              id
              name
              email
            }
          }
        `,
        })

      // console.log("GraphQL Response:", res.body);
      expect(res).to.have.status(200)
      expect(res.body.data.users).to.be.an('array').that.has.length(2)
    })

    it('should return an empty array if no users exist', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            users {
              id
              name
              email
            }
          }
        `,
        })

      // console.log("GraphQL Response:", res.body);
      expect(res).to.have.status(200)
      expect(res.body.data.users).to.be.an('array').that.is.empty
    })
  })

  describe('Query: user(id)', () => {
    it('should return the correct user by ID', async () => {
      const user = await User.create({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      })

      // console.log(`Created user in DB: ID=${user.id}, Name=${user.name}, Email=${user.email}`);

      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
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
        })

      // console.log("GraphQL Response:", res.body);

      expect(res).to.have.status(200)
      expect(res.body.errors).to.be.undefined
      expect(res.body.data.user).to.not.be.null
      expect(res.body.data.user.name).to.equal('Jane Doe')
    })

    it('should fail if user ID does not exist', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            user(id: 99999) {
              id
            }
          }
        `,
        })

      // console.log("GraphQL Error Response:", res.status, res.body);

      expect(res).to.have.status(404)
      expect(res.body.errors).to.not.be.undefined
      expect(res.body.errors).to.be.an('array')
      expect(res.body.errors[0]).to.have.property(
        'message',
        'User with ID 99999 not found'
      )
      expect(res.body.data.user).to.be.null
    })
  })
})
