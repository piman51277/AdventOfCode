const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const coordinates = [];
for (const line of input) {
  coordinates.push(line.split(",").map(Number));
}

const GRID_SIZE = 30;

//create a 30x30x30 grid
const grid = new Array(GRID_SIZE);
for (let i = 0; i < grid.length; i++) {
  grid[i] = new Array(GRID_SIZE);
  for (let j = 0; j < grid[i].length; j++) {
    grid[i][j] = Array.from({ length: GRID_SIZE }, () => 0);
  }
}

//plot the coordinates on the grid
for (let i = 0; i < coordinates.length; i++) {
  grid[coordinates[i][0]][coordinates[i][1]][coordinates[i][2]] = 1;
}

//start at 1,1,1 and flood fill
const queue = [[1, 1, 1]];
while (queue.length) {
  const [x, y, z] = queue.shift();
  if (
    x < 0 ||
    x >= GRID_SIZE ||
    y < 0 ||
    y >= GRID_SIZE ||
    z < 0 ||
    z >= GRID_SIZE
  ) {
    continue;
  }
  if (grid[x][y][z] === 0) {
    grid[x][y][z] = 2;
    queue.push([x + 1, y, z]);
    queue.push([x - 1, y, z]);
    queue.push([x, y + 1, z]);
    queue.push([x, y - 1, z]);
    queue.push([x, y, z + 1]);
    queue.push([x, y, z - 1]);
  }
}

let sides = 0;
//loop through the coordinates
for (let i = 0; i < coordinates.length; i++) {
  const [x, y, z] = coordinates[i];

  //check how many sides are not touching
  if (x === 0 || x === GRID_SIZE - 1) {
    sides++;
  }
  if (y === 0 || y === GRID_SIZE - 1) {
    sides++;
  }
  if (z === 0 || z === GRID_SIZE - 1) {
    sides++;
  }

  //check if the coordinate is touching another coordinate
  if (x < GRID_SIZE - 1 && grid[x + 1][y][z] === 2) {
    sides++;
  }
  if (x > 0 && grid[x - 1][y][z] === 2) {
    sides++;
  }
  if (y < GRID_SIZE - 1 && grid[x][y + 1][z] === 2) {
    sides++;
  }
  if (y > 0 && grid[x][y - 1][z] === 2) {
    sides++;
  }
  if (z < GRID_SIZE - 1 && grid[x][y][z + 1] === 2) {
    sides++;
  }
  if (z > 0 && grid[x][y][z - 1] === 2) {
    sides++;
  }
}

console.log(sides);
