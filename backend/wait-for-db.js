const config = require('./config');
const logger = require('./logger/logger');
const mysql = require('mysql2/promise');
const seedDatabase = require('./seed/seeder');
const app = require('./server');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

const port = config.port;

async function checkDatabaseConnection() {
  config.assertRuntimeConfig();

  let retries = 5;
  while (retries) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.end();
      logger.info('Database connection established.');

      // A seeder csak kifejezett kérésre fut (SEED_DATABASE=true), mert törli a felhasználókat.
      if (config.seedDatabase) {
        await seedDatabase();
      }

      // Indítjuk az alkalmazást, miután a seedelés befejeződött.
      app.listen(port, () => {
        logger.info(`App listening at http://localhost:${port}`);
      });
      break;
    } catch (err) {
      logger.error('Unable to connect to the database. Retrying in 5 seconds...');
      logger.error(err.stack); // Részletes hibaüzenet stack trace-szel
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  if (!retries) {
    logger.error('Failed to connect to the database after multiple attempts.');
    process.exit(1);
  }
}

checkDatabaseConnection();