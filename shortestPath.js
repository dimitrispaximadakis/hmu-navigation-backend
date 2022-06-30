/**
 * Finds and returns the most close node to the current node.
 * @param {Array} distances - All the distances between nodes.
 * @param {Array} visited - All the visited nodes.
 * @returns {String} The shortest distanced node.
 */
const shortestDistanceNode = (distances, visited) => {
    let shortest = null;

    for (let node in distances) {
        let currentIsShortest =
            shortest === null || distances[node] < distances[shortest];
        if (currentIsShortest && !visited.includes(node)) {
            shortest = node;
        }
    }
    return shortest;
};
/**
 * Finds the shortest path between 2 nodes.
 * @param {Object} graph - A object that represents a node and contains all the nodes.
 * @param {String} startNode - The start of the path.
 * @param {String} endNode - The destination of the path.
 * @returns {Object} Distance of the shortest path and the path.
 */
const findShortestPath = (graph, startNode, endNode) => {
    // establish object for recording distances from the start node
    let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);

    // track paths
    let parents = { endNode: null };
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }

    // track nodes that have already been visited
    let visited = [];

    // find the nearest node
    let node = shortestDistanceNode(distances, visited);

    // for that node
    while (node) {
        // find its distance from the start node & its child nodes
        let distance = distances[node];
        let children = graph[node];
        // for each of those child nodes
        for (let child in children) {
            // make sure each child node is not the start node
            if (String(child) === String(startNode)) {
                continue;
            } else {
                // save the distance from the start node to the child node
                let newdistance = distance + children[child];
                // if there's no recorded distance from the start node to the child node in the distances object
                // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
                // save the distance to the object
                // record the path
                if (!distances[child] || distances[child] > newdistance) {
                    distances[child] = newdistance;
                    parents[child] = node;
                }
            }
        }
        // move the node to the visited set
        visited.push(node);
        // move to the nearest neighbor node
        node = shortestDistanceNode(distances, visited);
    }

    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();

    // return the shortest path from start node to end node & its distance
    let results = {
        distance: distances[endNode],
        path: shortestPath,
    };
    return results;
}



/**
* Transforms data of points to a parsable format of a graph so it can be used in the djikstra algorithm.
* @param {Array} array
* @returns {Object} - Object that represents a graph.
*
*/
const transformData = (array) => {
    let tempGraph = {};

    array.forEach(point => {
        if (!tempGraph.hasOwnProperty(`node${point.point_id}`)) {
            tempGraph[`node${point.point_id}`] = { [`node${point.destination_id}`]: point.distance };
        } else {
            const key = `node${point.destination_id}`;
            tempGraph[`node${point.point_id}`] = { ...tempGraph[`node${point.point_id}`], ...{ [key]: point.distance } }
        }
    })

    return tempGraph;
}



/**
* Runs the needed functions in order the program to run.
*
* @param {Array} points - data fetched from data base.
* @param {String} startingPoint - the starting node of the path.
* @param {String} startingPoint - the destination node of the path.
*
* @returns {Object} the result of findShortestPath function.
*
*/
const controller = (points, startingPoint, destinationPoint) => {
    const graph = transformData(points);
    const shortestPath = findShortestPath(graph, startingPoint, destinationPoint);

    return shortestPath;
}

module.exports = { controller }