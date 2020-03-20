let pool;
const createPool = async () => {
  pool = await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    // If connecting via TCP, enter the IP and port instead
    // host: 'localhost',
    // port: 3306,

    //...
  });
};
createPool();
