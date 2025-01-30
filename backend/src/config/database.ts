import { Sequelize, Dialect } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  DB_PORT,
  INDOCKER,
} = process.env

if (!DB_NAME || !DB_USER || !DB_HOST || !DB_DIALECT) {
  throw new Error('Missing required database configuration in .env')
}

// Initialize Sequelize instance
const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  dialect: (DB_DIALECT as Dialect) || 'postgres',
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000,
  // },
})

const isDocker = process.env.INDOCKER === 'OUI'
const migrationPath = isDocker ? '/app/migrations/*.ts' : './migrations/*.ts'

// Configure Umzug for migration management
const migrationConfig = new Umzug({
  migrations: {
    glob: migrationPath,
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: process.env.NODE_ENV === 'test' ? undefined : console,
})

// Function to apply migrations
const runMigrations = async () => {
  try {
    console.log('Checking for pending migrations...')
    await migrationConfig.up() // Applies all migrations
    console.log('All migrations applied successfully.')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Function to connect to the database with retries and apply migrations
const connectToDatabase = async () => {
  const retries = 5 // Number of retries
  const waitTime = 5000 // Time to wait between retries (in ms)

  for (let i = 0; i < retries; i++) {
    try {
      // Authenticate the database connection
      await sequelize.authenticate()
      console.log('Database connection established successfully.')

      // Run migrations to ensure the database schema is up-to-date
      await runMigrations()
      console.log('Migrations applied successfully.')
      return
    } catch (err) {
      console.error(
        `Database connection failed. Retrying (${i + 1}/${retries})...`,
        err
      )
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      } else {
        console.error('Max retries reached. Could not connect to the database.')
        process.exit(1)
      }
    }
  }
}

export {
  sequelize,
  runMigrations,
  connectToDatabase
}