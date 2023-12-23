const fs = require("fs");
let input = fs.readFileSync("input.txt", "utf8")

//replace all > and v with .
input = input.replace(/>/g, ".");
input = input.replace(/v/g, ".");

//replace and X with .
input = input.replace(/X/g, ".");

input = input.split("\n");
input.pop()

const grid = input.map((line) => line.split(""));



function getNeighborsLocationWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y, 0] : null, //left
    x < grid.length - 1 ? [x + 1, y, 1] : null, //right
    y > 0 ? [x, y - 1, 2] : null, //up
    y < grid[0].length - 1 ? [x, y + 1, 3] : null //down
  ];
  return neighbors.filter(k => k !== null && condition(k[0], k[1]));
}

const nodes = []

//scan through the entire thing and look for points with >3 neighbors
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === ".") {
      const neighbors = getNeighborsLocationWithCondition(x, y, (x, y) => "." == (grid[y][x]));
      if (neighbors.length > 2) {
        nodes.push([x, y]);
      }
    }
  }
}

const nodeCount = nodes.length;

//create an adjacency matrix
const adjMatrix = new Array(nodeCount).fill(0).map(() => new Array(nodeCount).fill(0));

//convert each node into a lookup set
const nodesSet = new Set();
for (let i = 0; i < nodes.length; i++) {
  nodesSet.add(`${nodes[i][0]},${nodes[i][1]}`);
}


//for each node, find the shortest path to every other node
for (let i = 0; i < nodes.length; i++) {
  const [x, y] = nodes[i];

  const seen = new Set();
  const queue = [[x, y, 0]];

  const distances = new Array(nodeCount).fill(0).map(() => Infinity);

  while (queue.length > 0) {
    const [x, y, steps] = queue.shift();

    const id = `${x},${y}`;
    if (seen.has(id)) continue;
    seen.add(id);

    //if we found a node
    if (nodesSet.has(id)) {
      const index = nodes.findIndex(k => k[0] === x && k[1] === y);

      //if it isn't itself
      if (index !== i) {
        distances[index] = steps;
        continue;
      }
    }

    const neighbors = getNeighborsLocationWithCondition(x, y, (x, y) => "." == (grid[y][x]));

    for (const [nx, ny] of neighbors) {
      queue.push([nx, ny, steps + 1]);
    }
  }

  //add the distances to the adjacency matrix
  for (let j = 0; j < distances.length; j++) {
    adjMatrix[i][j] = distances[j];
  }
}

const start = [1, 0];
const end = [grid.length - 2, grid[0].length - 1];

//what are the nodes that are closest to the start and end?

let closestStart = Infinity;
let closestEnd = Infinity;
let closestStartIndex = -1;
let closestEndIndex = -1;

for (let i = 0; i < nodes.length; i++) {
  const [x, y] = nodes[i];

  const seen = new Set();

  const queue = [[x, y, 0]];

  while (queue.length > 0) {
    const [x, y, steps] = queue.shift();

    const id = `${x},${y}`;
    if (seen.has(id)) continue;
    seen.add(id);

    if (x === start[0] && y === start[1]) {
      if (steps < closestStart) {
        closestStart = steps;
        closestStartIndex = i;
      }
    }

    if (x === end[0] && y === end[1]) {
      if (steps < closestEnd) {
        closestEnd = steps;
        closestEndIndex = i;
      }
    }

    const neighbors = getNeighborsLocationWithCondition(x, y, (x, y) => "." == (grid[y][x]));

    for (const [nx, ny] of neighbors) {
      queue.push([nx, ny, steps + 1]);
    }
  }
}

//the node closest to the start is the first node
const firstNode = closestStartIndex;

//the node closest to the end is the last node
const lastNode = closestEndIndex;

//do a dfs to find the longest path from first to last, nodes can only be visited once

let longestPath = 0;

function dfs(node, steps, visited) {
  //mark as visited
  visited[node] = true;

  //if we are at the last node, we are done
  if (node === lastNode) {
    longestPath = Math.max(longestPath, steps);
    return;
  }

  //traverse all neighbors
  for (let i = 0; i < nodes.length; i++) {
    if (adjMatrix[node][i] !== Infinity && !visited[i]) {
      //console.log(node, i, steps + adjMatrix[node][i] - 1);
      dfs(i, steps + adjMatrix[node][i], [...visited]);
    }
  }
}

dfs(firstNode, 0, new Array(nodeCount).fill(0).map(() => false));

console.log(longestPath + closestStart + closestEnd)