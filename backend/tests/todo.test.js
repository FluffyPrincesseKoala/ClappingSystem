import { expect } from "chai" // Correctly import only `expect` from chai
import chai from "chai" // Import `chai` itself for plugin use
import chaiHttp from "chai-http" // Import the chai-http plugin

chai.use(chaiHttp) // Use the chai-http plugin

const baseURL = process.env.TEST_URL || "http://localhost:4000"

describe("Todo Clapping System API Tests", () => {
    it("should return 'App is ready!' from the /ready endpoint", async () => {
        const res = await chai.request(baseURL).get("/ready")
        expect(res).to.have.status(200)
        expect(res.body).to.have.property("message", "App is ready!")
    })

    it("should fetch todos", async () => {
        const res = await chai.request(baseURL).post("/graphql").send({
            query: `{
                todos {
                    id
                    title
                    creator {
                        id
                        name
                    }
                    totalClaps
                }
            }`
        })
        expect(res).to.have.status(200)
        expect(res.body.data.todos).to.be.an("array")
    })

    it("should create a todo", async () => {
        const res = await chai.request(baseURL).post("/graphql").send({
            query: `mutation {
                createTodo(title: "Test Todo", creatorId: 1) {
                    id
                    title
                    creator {
                        id
                        name
                    }
                }
            }`
        })
        expect(res).to.have.status(200)
        expect(res.body.data.createTodo).to.have.property("id")
        expect(res.body.data.createTodo).to.have.property("title", "Test Todo")
    })
})
