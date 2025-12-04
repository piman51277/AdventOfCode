const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

function getNeighborsValue(x, y) {
  var neighbors = [
    x > 0 ? grid[x - 1][y] : null,
    x < grid[0].length - 1 ? grid[x + 1][y] : null,
    y > 0 ? grid[x][y - 1] : null,
    y < grid.length - 1 ? grid[x][y + 1] : null,
    x > 0 && y > 0 ? grid[x - 1][y - 1] : null,
    x > 0 && y < grid.length - 1 ? grid[x - 1][y + 1] : null,
    x < grid[0].length - 1 && y > 0 ? grid[x + 1][y - 1] : null,
    x < grid[0].length - 1 && y < grid.length - 1 ? grid[x + 1][y + 1] : null,
  ];
  return neighbors.filter((k) => k !== null);
}

let count = 0;
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    if (grid[i][j] === "@") {
      const neighbors = getNeighborsValue(i, j);
      const atCount = neighbors.filter((k) => k === "@").length;
      if (atCount < 4) {
        count++;
      }
    }
  }
}
console.log(count);
