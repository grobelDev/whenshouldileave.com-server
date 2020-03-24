const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Knex = require('knex');

const results = require('./results.js');

const app = express();

let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.use(cors());
} else {
  let corsOptions = {
    origin: 'https://client-gmhtsvfjha-uc.a.run.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
}

// // [START cloud_sql_postgres_knex_create]
// // Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
// const connect = () => {
//   // Configure which instance and what database user to connect with.
//   // Remember - storing secrets in plaintext is potentially unsafe. Consider using
//   // something like https://cloud.google.com/kms/ to help keep secrets secret.
//   const config = {
//     user: process.env.DB_USER, // e.g. 'my-user'
//     password: process.env.DB_PASS, // e.g. 'my-user-password'
//     database: process.env.DB_NAME // e.g. 'my-database'
//   };

//   if (env === 'development') {
//     config.host = '127.0.0.1';
//     config.port = '3306';
//   } else {
//     config.host = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
//   }

//   // Establish a connection to the database
//   const knex = Knex({
//     client: 'pg',
//     connection: config
//   });

//   // ... Specify additional properties here.
//   // [START_EXCLUDE]

//   // [START cloud_sql_postgres_knex_limit]
//   // 'max' limits the total number of concurrent connections this pool will keep. Ideal
//   // values for this setting are highly variable on app design, infrastructure, and database.
//   knex.client.pool.max = 5;
//   // 'min' is the minimum number of idle connections Knex maintains in the pool.
//   // Additional connections will be established to meet this value unless the pool is full.
//   knex.client.pool.min = 5;
//   // [END cloud_sql_postgres_knex_limit]
//   // [START cloud_sql_postgres_knex_timeout]
//   // 'acquireTimeoutMillis' is the maximum number of milliseconds to wait for a connection checkout.
//   // Any attempt to retrieve a connection from this pool that exceeds the set limit will throw an
//   // SQLException.
//   knex.client.pool.createTimeoutMillis = 30000; // 30 seconds
//   // 'idleTimeoutMillis' is the maximum amount of time a connection can sit in the pool. Connections that
//   // sit idle for this many milliseconds are retried if idleTimeoutMillis is exceeded.
//   knex.client.pool.idleTimeoutMillis = 600000; // 10 minutes
//   // [END cloud_sql_postgres_knex_timeout]
//   // [START cloud_sql_postgres_knex_backoff]
//   // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
//   knex.client.pool.createRetryIntervalMillis = 200; // 0.2 seconds
//   // [END cloud_sql_postgres_knex_backoff]
//   // [START cloud_sql_postgres_knex_lifetime]
//   // 'acquireTimeoutMillis' is the maximum possible lifetime of a connection in the pool. Connections that
//   // live longer than this many milliseconds will be closed and reestablished between uses. This
//   // value should be several minutes shorter than the database's timeout value to avoid unexpected
//   // terminations.
//   knex.client.pool.acquireTimeoutMillis = 600000; // 10 minutes
//   // [START cloud_sql_postgres_knex_lifetime]

//   // [END_EXCLUDE]
//   return knex;
// };

// const knex = connect();
// [END cloud_sql_postgres_knex_create]

// [START cloud_sql_postgres_knex_connection]
/**
 * Insert a directions record into the database.
 *
 * @param {object} knex The Knex connection object.
 * @param {object} newDirections The directions record to insert.
 * @returns {Promise}
 */
// const insertDirections = async (knex, newDirections) => {
//   try {
//     return await knex('directions').insert(newDirections);
//   } catch (err) {
//     throw Error(err);
//   }
// };
// [END cloud_sql_postgres_knex_connection]

/**
 * Retrieve all directions data
 *
 * @param {object} knex The Knex connection object.
 * @returns {Promise}
 */
// const getDirectionsData = async knex => {
//   return await knex.select('*').from('directions');
// };

/**
 * Retrieve all test data
 *
 * @param {object} knex The Knex connection object.
 * @returns {Promise}
 */
// const getTestData = async knex => {
//   return await knex.select('*').from('guestbook');
// };

app.get('/', async (req, res) => {
  try {
    let startingPoint = decodeURIComponent(req.query.startingPoint);
    let destination = decodeURIComponent(req.query.destination);

    // const directionsData = await getDirectionsData(knex);

    // console.log('databaseData:', databaseData);
    // console.log('directionsData:', directionsData);

    if (startingPoint === 'undefined' || destination === 'undefined') {
      console.log('invalid inputs');
      return res
        .status(400)
        .send('Invalid Directions')
        .end();
    }

    let newDirections = {
      startingpoint: startingPoint,
      destination: destination
    };

    // try {
    //   await insertDirections(knex, newDirections);
    // } catch (err) {
    //   console.log(`Error while attempting to submit directions:${err}`);
    //   res
    //     .status(500)
    //     .send('Unable to insert directions; see logs for more details.')
    //     .end();
    //   return;
    // }
    let response = await results.getResults(req);
    let sanitizedResponse = response.map(direction => {
      let newDirection = direction;
      delete newDirection['requestUrl'];
      delete newDirection['query'].key;
      return newDirection;
    });

    res.status(200).send(sanitizedResponse);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.get('/test', (req, res) => {
  console.log('Hello world received a request.');
  res.status(200).send(`Hello World!`);
});

module.exports = app;
