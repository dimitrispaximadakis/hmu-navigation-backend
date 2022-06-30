const { Client } = require('pg')

/* Connecting to the database using the needed credentials. */
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "root",
    database: "hmu"
})

module.exports = client