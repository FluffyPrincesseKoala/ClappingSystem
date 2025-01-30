import { expect } from 'chai'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { sequelize } from '../src/config/database.js'
import { models } from '../src/models/index.js'

const { User, Todo, Clap } = models

chai.use(chaiHttp)

const baseURL = process.env.TEST_URL || 'http://localhost:4100'

describe('Clap API Tests', () => {
  let user: InstanceType<typeof User>
  let todo: InstanceType<typeof Todo>

  beforeEach(async () => {
    await sequelize.query('TRUNCATE TABLE "claps" RESTART IDENTITY CASCADE;')
    const [usertmp, created] = await User.findOrCreate({
      where: { email: "john.doe@example.com", name: "John Doe" }
    })
    user = usertmp

    if (!user) {
      throw new Error("User creation failed, 'user.id' is undefined")
    }

    // Ensure `user.id` is passed correctly
    todo = await Todo.create({
      title: 'Test Todo',
      creatorId: user.id
    })

    if (!todo || !todo.id) {
      throw new Error("Todo creation failed, 'todo.id' is undefined")
    }
  })

  describe('Mutation: clapTodo', () => {
    it('should add a clap to a todo', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          mutation {
            clapTodo(todoId: ${todo.id}, userId: ${user.id}, count: 1) {
              id
              count
              userId
              todoId
            }
          }
        `,
        })

      console.log("response:", res.body)

      expect(res).to.have.status(200)
      expect(res.body.data.clapTodo).to.be.an('object')
      expect(res.body.data.clapTodo.count).to.equal(1)
    })

    it('should increment claps if already existing', async () => {
      console.log('creating the clap')
      const newClap = await Clap.create({ todoId: todo.id, userId: user.id, count: 2 })
      console.log('created  clap:', newClap)

      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          mutation {
            clapTodo(todoId: ${todo.id}, userId: ${user.id}, count: 2) {
              id
              count
            }
          }
        `,
        })

      expect(res).to.have.status(200)
      expect(res.body.data.clapTodo).to.be.an('object')
      expect(res.body.data.clapTodo.count).to.equal(4) // Previous 2 + New 2
    })

    it('should fail if todo does not exist', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          mutation {
            clapTodo(todoId: 9999, userId: ${user.id}, count: 1) {
              id
            }
          }
        `,
        })

      expect(res).to.have.status(400)
      expect(res.body.errors).to.not.be.undefined
      const errors = res.body.errors
      expect(errors[0].message).to.include('Failed to find clap relation')
      expect(errors[0].extensions.message).to.include('cannot find todo with id: 9999')
    })
  })

  describe('Query: claps', () => {
    it('should fetch all claps for a user', async () => {
      await Clap.bulkCreate([
        { todoId: todo.id, userId: user.id, count: 1 },
        { todoId: todo.id, userId: user.id, count: 2 },
      ])

      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            user(id: ${user.id}) {
              claps {
                id
                count
              }
            }
          }
        `,
        })

      expect(res).to.have.status(200)
      expect(res.body.data.user.claps).to.be.an('array').that.has.length(2)
    })

    it('should return an empty array if user has no claps', async () => {
      const res = await chai
        .request(baseURL)
        .post('/graphql')
        .send({
          query: `
          query {
            user(id: ${user.id}) {
              claps {
                id
                count
              }
            }
          }
        `,
        })

      expect(res).to.have.status(200)
      expect(res.body.data.user.claps).to.be.an('array').that.is.empty
    })
  })
})
