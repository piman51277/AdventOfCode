const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));

let pos = { x: 0, y: 0 };
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "^") {
      pos.x = x;
      pos.y = y;

      //remove the starting position
      grid[y][x] = ".";

      break;
    }
  }
}

const startPos = { x: pos.x, y: pos.y };

let loopCount = 0;

for (let h = 0; h < grid.length; h++) {
  for (let k = 0; k < grid[h].length; k++) {
    //deep copy the grid
    let gridCopy = JSON.parse(JSON.stringify(grid));

    pos = { x: startPos.x, y: startPos.y };

    //if x,y is start skip
    if (k === startPos.x && h === startPos.y) {
      continue;
    }

    //if the square is already a wall, skip
    if (gridCopy[h][k] === "#") {
      continue;
    }

    //set the position at x,y to be a wall
    gridCopy[h][k] = "#";

    const visited = new Set();

    let direction = "up";
    visited.add(`${pos.x},${pos.y}`);

    let overlapCount = 0;

    while (true) {
      //get the current position
      let x = pos.x;
      let y = pos.y;

      if (direction === "up") {
        while (gridCopy[y - 1] && gridCopy[y - 1][x] !== "#") {
          y--;
        }

        //if we hit the edge, break
        if (y == 0) {
          break;
        }

        //otherwise turn right
        direction = "right";
      } else if (direction === "down") {
        while (gridCopy[y + 1] && gridCopy[y + 1][x] !== "#") {
          y++;
        }

        if (y >= gridCopy.length - 1) {
          break;
        }

        direction = "left";
      } else if (direction === "left") {
        while (gridCopy[y][x - 1] && gridCopy[y][x - 1] !== "#") {
          x--;
        }

        if (x == 0) {
          break;
        }

        direction = "up";
      } else if (direction === "right") {
        while (gridCopy[y][x + 1] && gridCopy[y][x + 1] !== "#") {
          x++;
        }

        if (x >= gridCopy[y].length - 1) {
          break;
        }

        direction = "down";
      }

      if (visited.has(`${x},${y}`)) {
        overlapCount++;
      }
      visited.add(`${x},${y}`);

      if (overlapCount > 10) {
        loopCount++;
        break;
      }

      pos.x = x;
      pos.y = y;
    }
  }
}

//get number of visited positions
console.log(loopCount);
