const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

const inRegion = new Set();
const regions = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    //check if this is in a region
    if (inRegion.has(`${x},${y}`)) {
      continue;
    }

    //start a new region
    const regionType = grid[y][x];
    const regionCells = new Set();

    //start bfs
    const queue = [[x, y]];
    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (regionCells.has(`${x},${y}`)) {
        continue;
      }
      regionCells.add(`${x},${y}`);
      inRegion.add(`${x},${y}`);

      //add neighbors to the queue
      const neighbors = [
        x > 0 ? [x - 1, y, grid[y][x - 1]] : null,
        x < grid.length - 1 ? [x + 1, y, grid[y][x + 1]] : null,
        y > 0 ? [x, y - 1, grid[y - 1][x]] : null,
        y < grid[0].length - 1 ? [x, y + 1, grid[y + 1][x]] : null,
      ].filter((neighbor) => neighbor && neighbor[2] === regionType);
      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }
    }

    regions.push({
      type: regionType,
      cells: regionCells,
    });
  }
}

let score = 0;
for (const region of regions) {
  if (region.type === undefined) {
    continue;
  }

  //get bounds for the region
  let xLower = 0;
  let xUpper = 0;
  let yLower = 0;
  let yUpper = 0;
  for (const cell of [...region.cells]) {
    const [x, y] = cell.split(",").map(Number);
    xLower = Math.min(x, xLower);
    xUpper = Math.max(x, xUpper);
    yLower = Math.min(y, yLower);
    yUpper = Math.max(y, yUpper);
  }

  let xdisplacement = xLower;
  let ydisplacement = yLower;

  //create a grid that is 2 bigger
  const regionGrid = Array.from({ length: yUpper - yLower + 7 }, () =>
    Array.from({ length: xUpper - xLower + 7 }, () => 0)
  );

  //place all points in the grid with displacement
  for (const cell of [...region.cells]) {
    const [x, y] = cell.split(",").map(Number);
    regionGrid[y + 2][x + 2] = 1;
  }

  //look for all points that touch a true cell
  let borderCount = 0;
  for (let y = 0; y < regionGrid.length; y++) {
    for (let x = 0; x < regionGrid[0].length; x++) {
      //console.log(x, y, regionGrid[y][x]);
      if (regionGrid[y][x] == 1) {
        continue;
      }

      const neighbors = [
        y > 0 ? regionGrid[y - 1][x] : 0,
        y < regionGrid.length - 1 ? regionGrid[y + 1][x] : 0,
        x > 0 ? regionGrid[y][x - 1] : 0,
        x < regionGrid[0].length - 1 ? regionGrid[y][x + 1] : 0,
      ];

      if (neighbors.includes(1)) {
        //console.log("border");
        regionGrid[y][x] = 2;
        borderCount++;
      }

      //if we are surrounded by more than 1, we are a corner
      if (neighbors.filter((n) => n === 1).length > 1) {
        //console.log("corner");
        regionGrid[y][x] = 3;
        borderCount += neighbors.filter((n) => n === 1).length - 1;
      }
    }
  }

  //print out the grid
  for (let y = 0; y < regionGrid.length; y++) {
    console.log(regionGrid[y].map((cell) => cell).join(""));
  }

  console.log(region.type, borderCount, region.cells.size);
  score += borderCount * region.cells.size;
}

console.log(score);
