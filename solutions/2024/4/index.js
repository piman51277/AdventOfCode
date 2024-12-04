const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

//word search look for XMAS
let count = 0;
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    if (grid[y][x] === "X") {
      //start search in all directions

      //orth
      if (
        x + 3 < width &&
        grid[y][x + 1] === "M" &&
        grid[y][x + 2] === "A" &&
        grid[y][x + 3] === "S"
      ) {
        count++;
      }
      if (
        x - 3 >= 0 &&
        grid[y][x - 1] === "M" &&
        grid[y][x - 2] === "A" &&
        grid[y][x - 3] === "S"
      ) {
        count++;
      }
      if (
        y + 3 < height &&
        grid[y + 1][x] === "M" &&
        grid[y + 2][x] === "A" &&
        grid[y + 3][x] === "S"
      ) {
        count++;
      }
      if (
        y - 3 >= 0 &&
        grid[y - 1][x] === "M" &&
        grid[y - 2][x] === "A" &&
        grid[y - 3][x] === "S"
      ) {
        count++;
      }

      //diagonal
      if (
        x + 3 < width &&
        y + 3 < height &&
        grid[y + 1][x + 1] === "M" &&
        grid[y + 2][x + 2] === "A" &&
        grid[y + 3][x + 3] === "S"
      ) {
        count++;
      }

      if (
        x - 3 >= 0 &&
        y - 3 >= 0 &&
        grid[y - 1][x - 1] === "M" &&
        grid[y - 2][x - 2] === "A" &&
        grid[y - 3][x - 3] === "S"
      ) {
        count++;
      }

      if (
        x + 3 < width &&
        y - 3 >= 0 &&
        grid[y - 1][x + 1] === "M" &&
        grid[y - 2][x + 2] === "A" &&
        grid[y - 3][x + 3] === "S"
      ) {
        count++;
      }

      if (
        x - 3 >= 0 &&
        y + 3 < height &&
        grid[y + 1][x - 1] === "M" &&
        grid[y + 2][x - 2] === "A" &&
        grid[y + 3][x - 3] === "S"
      ) {
        count++;
      }
    }
  }
}

console.log(count );
