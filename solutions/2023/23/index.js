const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

const start = [1, 0];
const end = [grid.length - 2, grid[0].length - 1];

const stack = [[...start, 0, 3]];
const seen = new Set();


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

const opposites = {
  0: 1,
  1: 0,
  2: 3,
  3: 2
}


let longestPath = 0;

while (stack.length > 0) {
  const [x, y, steps, initialDir] = stack.shift();

  if (x === end[0] && y === end[1]) {
    longestPath = Math.max(longestPath, steps);
    continue;
  }


  const id = `${x},${y},${steps}`;
  if (seen.has(id)) continue;
  seen.add(id);

  const neighbors = getNeighborsLocationWithCondition(x, y, (x, y) => ".v>".includes(grid[y][x]));

  //console.log(grid[y][x], x, y, steps, initialDir, neighbors);

  //get the value of grid at location
  const val = grid[y][x];

  for (const [nx, ny, direction] of neighbors) {
    if (direction != 3 && val === "v") {
      continue;
    }
    if (direction != 1 && val === ">") {
      continue;
    }

    //it also can't be the opposite direction from the initial direction
    if (direction === opposites[initialDir]) {
      //console.log("opposite", direction, opposites[initialDir]);
      continue;
    }

    //console.log("passed", nx, ny, direction);

    stack.push([nx, ny, steps + 1, direction]);
  }
}

console.log(longestPath);