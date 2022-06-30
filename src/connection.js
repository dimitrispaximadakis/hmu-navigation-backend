const { Client } = require('pg')

/* Connecting to the database using the needed credentials. */
const client = new Client({
    /* Connection Setting if you are using localhost. */
    // host: "localhost",  
    // user: "postgres",
    // port: 5432,
    // password: "root",
    // database: "hmu"
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


module.exports = client