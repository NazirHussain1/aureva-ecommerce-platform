const { Sequelize } = require("sequelize");

let sequelize;

// Use SQLite in-memory database for testing
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  // Railway provides MYSQLHOST, MYSQLUSER, etc. as well as DB_HOST, DB_USER, etc.
  // Try Railway variables first, then fall back to custom variables
  const dbHost = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
  const dbUser = process.env.MYSQLUSER || process.env.DB_USER || 'root';
  const dbPass = process.env.MYSQLPASSWORD || process.env.DB_PASS || '';
  const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'aureva';
  const dbPort = process.env.MYSQLPORT || process.env.DB_PORT || 3306;

  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

module.exports = sequelize;
