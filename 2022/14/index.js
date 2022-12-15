const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const grid = [];
for (let i = 0; i < 200; i++) {
  grid[i] = [];
  for (let j = 0; j < 200; j++) {
    grid[i][j] = 0;
  }
}

//grid is x,y shift all positions 200 units left

for (let line of input) {
  const coordinates = line
    .split(" -> ")
    .map((n) => n.split(",").map((n) => parseInt(n)))
    .map((n) => [n[0] - 400, n[1]]);

  let workingFrom = coordinates[0];
  for (let i = 1; i < coordinates.length; i++) {
    //fill in all the squares between the two points
    const workingTo = coordinates[i];
    const xDiff = workingTo[0] - workingFrom[0];
    const yDiff = workingTo[1] - workingFrom[1];
    const xDir = xDiff > 0 ? 1 : -1;
    const yDir = yDiff > 0 ? 1 : -1;
    for (let x = 0; x <= Math.abs(xDiff); x++) {
      for (let y = 0; y <= Math.abs(yDiff); y++) {
        grid[workingFrom[0] + x * xDir][workingFrom[1] + y * yDir] = 1;
      }
    }
    workingFrom = workingTo;
  }
}

//start filling with sand
const itr = 10000;
for (let i = 0; i < itr; i++) {
  let pos = [100, 0];

  while (true) {
    //keep increasing y until we hit a wall
    while (grid[pos[0]][pos[1] + 1] === 0) {
      pos[1]++;
    }

    //if we hit the bottom, stop
    if (pos[1] === 199) {
      console.log(i);
      process.exit();
      break;
    }

    //sand logic
    if (pos[0] - 1 > 0 && grid[pos[0] - 1][pos[1] + 1] === 0) {
      pos[0]--;
    } else if (pos[0] + 1 < grid.length && grid[pos[0] + 1][pos[1] + 1] === 0) {
      pos[0]++;
    } else {
      break;
    }

    //if the position below is
  }

  grid[pos[0]][pos[1]] = 2;
}
