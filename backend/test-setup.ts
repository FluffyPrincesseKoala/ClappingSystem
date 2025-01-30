import { sequelize } from "./src/config/database.js";
import { Umzug, SequelizeStorage } from 'umzug'
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const umzug = new Umzug({
  migrations: {
    glob: join(__dirname, "../migrations/*.js"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined, // Silence migration logs
  // logger: console, // debug
});

before(async () => {
  await sequelize.sync({ force: true })
  await umzug.up()

})

after(async () => {
  await sequelize.close()
})