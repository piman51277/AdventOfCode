const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

/**
    | is a vertical pipe connecting north and south.
    - is a horizontal pipe connecting east and west.
    L is a 90-degree bend connecting north and east.
    J is a 90-degree bend connecting north and west.
    7 is a 90-degree bend connecting south and west.
    F is a 90-degree bend connecting south and east.
    . is ground; there is no pipe in thsrartis tile.
    S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */


// [N, E, S, W]
const directionMatrix = {
  "|": [1, 0, 1, 0],
  "-": [0, 1, 0, 1],
  "L": [1, 1, 0, 0],
  "J": [1, 0, 0, 1],
  "7": [0, 0, 1, 1],
  "F": [0, 1, 1, 0],
  ".": [0, 0, 0, 0],
  "S": [1, 1, 1, 1]
}

function getNeighborsCoords(x, y) {
  //is the current cell S?
  if (grid[y][x] === "S") {
    //if so, return all neighbors that would return back to S
    const left = x - 1 >= 0 && directionMatrix[grid[y][x - 1]][1] === 1;
    const right = x + 1 < grid.length && directionMatrix[grid[y][x + 1]][3] === 1;
    const up = y - 1 >= 0 && directionMatrix[grid[y - 1][x]][2] === 1;
    const down = y + 1 < grid[x].length && directionMatrix[grid[y + 1][x]][0] === 1;

    const neighbors = [];
    if (left) neighbors.push({ x: x - 1, y });
    if (right) neighbors.push({ x: x + 1, y });
    if (up) neighbors.push({ x, y: y - 1 });
    if (down) neighbors.push({ x, y: y + 1 });

    return neighbors;

  }


  const neighbors = [];

  const matrix = directionMatrix[grid[y][x]];


  //each one tells us if we can go N E S w

  if (matrix[0] === 1 && y - 1 >= 0) {
    neighbors.push({ x, y: y - 1 });
  }

  if (matrix[1] === 1 && x + 1 < grid.length) {
    neighbors.push({ x: x + 1, y });
  }

  if (matrix[2] === 1 && y + 1 < grid[x].length) {
    neighbors.push({ x, y: y + 1 });
  }

  if (matrix[3] === 1 && x - 1 >= 0) {
    neighbors.push({ x: x - 1, y });
  }

  return neighbors;
}

const visited = new Set();

//get location of s
const startY = grid.findIndex((row) => row.includes("S"));
const startX = grid[startY].findIndex((cell) => cell === "S");

function dfs(x, y, depth, path) {

  if (grid[y][x] === "S" && depth > 0) {
    console.log("found at " + depth);
    return [depth + 1, path];
  }

  if (visited.has(`${x},${y}`)) return [0, path]


  const neighbors = getNeighborsCoords(x, y);
  let maxDepth = 0;
  let maxPath = path;

  const queue = [];

  //add all neighbors to queue
  for (const neighbor of neighbors) {
    queue.push({ ...neighbor, depth: depth + 1, path: path + "->" + `${neighbor.x},${neighbor.y}` });
  }

  while (queue.length > 0) {
    const { x, y, depth, path } = queue.shift();

    //is this an end?
    if (grid[y][x] === "S" && depth > 2) {
      maxDepth = depth;
      maxPath = path;
    }

    if (visited.has(`${x},${y}`)) continue;

    visited.add(`${x},${y}`);

    //get neighbors of neighbor
    const neighbors = getNeighborsCoords(x, y);

    //add all neighbors to queue
    for (const neighbor of neighbors) {
      if (visited.has(`${neighbor.x},${neighbor.y}`) && grid[neighbor.y][neighbor.x] != "S") continue;
      queue.push({ ...neighbor, depth: depth + 1, path: path + "->" + `${neighbor.x},${neighbor.y}` });
      console.log({ ...neighbor, depth: depth + 1, path: path + "->" + `${neighbor.x},${neighbor.y}` });
    }
  }

  return [maxDepth, maxPath];
}

const loop = dfs(startX, startY, 0, `${startX},${startY}`);

console.log(loop);

const [depth, path] = loop;

const pathElements = path.split("->");

//get the middle element
const middleIndex = Math.floor(pathElements.length / 2);

console.log(middleIndex);