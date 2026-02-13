const { Sequelize } = require("sequelize");

let sequelize;

// Use SQLite in-memory database for testing
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false, // Disable SQL logging in tests
  });
} else {
  // Use MySQL for development and production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;
