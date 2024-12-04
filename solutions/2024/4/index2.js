const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

let count = 0;
for (let x = 1; x < width - 1; x++) {
  for (let y = 1; y < height - 1; y++) {
    if (grid[y][x] === "A") {
      //get letters from top left,right b
      const topLeft = grid[y - 1][x - 1];
      const topRight = grid[y - 1][x + 1];
      const bottomLeft = grid[y + 1][x - 1];
      const bottomRight = grid[y + 1][x + 1];

      //if opposite corners have MS
      const diagone =
        (topLeft === "M" && bottomRight === "S") ||
        (topLeft === "S" && bottomRight === "M");
      const diagtwo =
        (topRight === "S" && bottomLeft === "M") ||
        (topRight === "M" && bottomLeft === "S");
      if (diagone && diagtwo) {
        count++;
      }
    }
  }
}
console.log(count);
