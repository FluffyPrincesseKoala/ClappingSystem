import { expect } from 'chai'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { models } from "../src/models/index.js";
import { sequelize } from '../src/config/database.js';
const { User, Todo } = models

chai.use(chaiHttp)

const baseURL = process.env.TEST_URL || 'http://localhost:4100'

describe('Todo API Tests', () => {
  let user: InstanceType<typeof User>

  beforeEach(async () => {
    await sequelize.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;')
    user = await User.create({
      name: "Test User",
      email: "testuser_todo@example.com",
    });
  })

  describe('Mutation: createTodo', () => {
    it('should create a new todo', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          mutation {
            createTodo(title: "My First Todo", creatorId: ${user.id}) {
              id
              title
              creatorId
              createdAt
              updatedAt
            }
          }
        `,
        })

      expect(res).to.have.status(200)
      expect(res.body.data.createTodo).to.be.an('object')
      expect(res.body.data.createTodo.title).to.equal('My First Todo')
    })

    it('should fail if creatorId is invalid', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          mutation {
            createTodo(title: "Invalid Todo", creatorId: 9999) {
              id
            }
          }
        `,
        })


      expect(res).to.have.status(400)
      expect(res.body.errors).to.not.be.undefined
      expect(res.body.errors[0].message).to.include('Todo creator not found')
      expect(res.body.errors[0].extensions).to.have.property('message')
        .that.include('user not found with id: 9999')
    })
  })

  describe('Query: todos', () => {
    it('should fetch all todos for a user', async () => {
      await Todo.bulkCreate([
        { title: 'Todo 1', creatorId: user.id },
        { title: 'Todo 2', creatorId: user.id },
      ])

      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            user(id: ${user.id}) {
              todos {
                id
                title
              }
            }
          }
        `,
        })

      expect(res).to.have.status(200)
      expect(res.body.data.user.todos).to.be.an('array').that.has.length(2)
    })

    it('should return an empty array if user has no todos', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            user(id: ${user.id}) {
              todos {
                id
                title
              }
            }
          }
        `,
        })

      expect(res).to.have.status(200)
      expect(res.body.data.user.todos).to.be.an('array').that.is.empty
    })
  })
})
