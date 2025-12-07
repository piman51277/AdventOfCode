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
let split = 0;
grid[1][startX] = "|";
for (let y = 1; y < height - 1; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === "|") {
      if (grid[y + 1][x] === "^") {
        grid[y + 1][x - 1] = "|";
        grid[y + 1][x + 1] = "|";
        split++;
      } else if (grid[y + 1][x] === ".") {
        grid[y + 1][x] = "|";
      }
    }
  }
}
console.log(split);
