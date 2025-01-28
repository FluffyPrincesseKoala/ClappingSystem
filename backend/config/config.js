require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "clapping_system",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres"
  },
  production: {
    username: process.env.DB_USER || "prod_user",
    password: process.env.DB_PASSWORD || "securepassword",
    database: process.env.DB_NAME || "graphql_prod",
    host: process.env.DB_HOST || "prod-db-host",
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres"
  }
};
