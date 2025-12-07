const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;
let startX;
for (let x = 0; x < width; x++) {
  if (grid[0][x] === "S") {
    startX = x;
    break;
  }
}
let possGrid = Array.from({ length: height }, () => Array(width).fill(0));
let split = 0;
grid[1][startX] = "|";
possGrid[1][startX] = 1;
for (let y = 1; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === "|") {
      if (y + 1 < height) {
        if (grid[y + 1][x] === "^") {
          grid[y + 1][x - 1] = "|";
          grid[y + 1][x + 1] = "|";
          possGrid[y + 1][x - 1] += possGrid[y][x];
          possGrid[y + 1][x + 1] += possGrid[y][x];
          split++;
        } else {
          grid[y + 1][x] = "|";
          possGrid[y + 1][x] += possGrid[y][x];
        }
      }
    }
  }
}
let totalWays = 0;
for (let x = 0; x < width; x++) {
  totalWays += possGrid[height - 1][x];
}
console.log(totalWays);
