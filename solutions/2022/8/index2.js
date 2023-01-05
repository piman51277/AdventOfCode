const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const grid = input.map((line) => line.split(""));

let scores = new Array(grid.length)
  .fill(0)
  .map(() => new Array(grid[0].length).fill(0));

//for every position
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const treeHeight = grid[y][x];

    //check up
    let upScore = 0;
    for (let y2 = y - 1; y2 >= 0; y2--) {
      if (grid[y2][x] < treeHeight) {
        upScore++;
      } else {
        upScore++;
        break;
      }
    }

    //check down
    let downScore = 0;
    for (let y2 = y + 1; y2 < grid.length; y2++) {
      if (grid[y2][x] < treeHeight) {
        downScore++;
      } else {
        downScore++;
        break;
      }
    }

    //check left
    let leftScore = 0;
    for (let x2 = x - 1; x2 >= 0; x2--) {
      if (grid[y][x2] < treeHeight) {
        leftScore++;
      } else {
        leftScore++;
        break;
      }
    }

    //check right
    let rightScore = 0;
    for (let x2 = x + 1; x2 < grid[y].length; x2++) {
      if (grid[y][x2] < treeHeight) {
        rightScore++;
      } else {
        rightScore++;
        break;
      }
    }

    console.log(y, x, upScore, downScore, leftScore, rightScore);
    scores[y][x] = upScore * downScore * leftScore * rightScore;
  }
}

//get the max value
let max = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    max = Math.max(max, scores[y][x]);
  }
}
console.log(max);
