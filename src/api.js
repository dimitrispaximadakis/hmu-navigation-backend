/* Importing connection of the database */
const client = require('./connection.js');

/* Importing shortest path functionality */
const findShortestPath = require('../shortestPath');

/* Setting express */
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

/* Allow CORS */
const cors = require('cors');
app.use(cors());


/* Route of the "homepage" */
app.get('/', (req, res) => {
    res.send("/api/points or /api/shortest-path/start_id/destination_id");
})

/* Route that GET the data of points along with their names. */
app.get('/api/points', (req, res) => {
    client.query('SELECT point.*, poi. description FROM point, poi WHERE point.id = poi.point_id;', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
    })
})

/* Route that returns the shortest path calculated for the nodes that the user defines. */
app.get('/api/shortest-path/:start_id/:destination_id', (req, res) => {
    const start_id = req.params.start_id;
    const destination_id = req.params.destination_id;

    client.query('SELECT *, ST_DistanceSphere(a.geopoint, b.geopoint) as distance FROM point a, point b, connection WHERE a.id = connection.point_id AND b.id = connection.destination_id', (err, result) => {
        if (!err) {
            res.send(findShortestPath.controller(result.rows, `node${start_id}`, `node${destination_id}`));
        } else {
            res.send(err.message);
        }
    })

})

/* Default response if an uknown endpoint is used */
app.get('*', function (req, res) {
    res.status(404).send('Error 404: Page Not Found');
});

/* Starting the server at port process.env.PORT or 3000 */
app.listen(port, () => {
    console.log(`Server in now listening on port ${port}.`);
})

/* Connecting to database */
client.connect();

