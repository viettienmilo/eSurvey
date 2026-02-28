import mysql from 'mysql2/promise.js'

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

if (connection)
    console.log(`Connect to MySQL server successfully on database: ${process.env.DB_DATABASE}.`);

export default connection;