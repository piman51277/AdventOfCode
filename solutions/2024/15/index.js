const fs = require("fs");
let [gridRaw, movements] = fs
  .readFileSync("input.txt", "utf8")
  .trim()
  .split("\n\n");

movements = movements.replace(/\n/g, "").split("");

let grid = gridRaw.split("\n").map((row) => row.split(""));
let x = 0;
let y = 0;

//look for the @
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === "@") {
      x = j;
      y = i;
      break;
    }
  }
}

for (const mov of movements) {
  if (mov == "<") {
    //start scanning left from the current position
    let boxCount = 0;
    for (let i = x - 1; i >= 0; i--) {
      if (grid[y][i] === "#" || grid[y][i] === ".") {
        break;
      }
      if (grid[y][i] === "O") {
        boxCount++;
      }
    }

    //look at the postion to the left of the leftmost box
    const posX = x - boxCount - 1;
    const posY = y;

    //if the position is empty, move the player and the boxes
    if (grid[posY][posX] === ".") {
      grid[y][x] = ".";
      grid[posY][posX] = "O";
      grid[y][x - 1] = "@";
      x--;
    }
  } else if (mov == ">") {
    //start scanning right from the current position
    let boxCount = 0;
    for (let i = x + 1; i < grid[y].length; i++) {
      if (grid[y][i] === "#" || grid[y][i] === ".") {
        break;
      }
      if (grid[y][i] === "O") {
        boxCount++;
      }
    }

    const posX = x + boxCount + 1;
    const posY = y;

    //if the position is empty, move the player and the boxes
    if (grid[posY][posX] === ".") {
      grid[y][x] = ".";
      grid[posY][posX] = "O";
      grid[y][x + 1] = "@";
      x++;
    }
  } else if (mov == "^") {
    //start scanning up from the current position
    let boxCount = 0;
    for (let i = y - 1; i >= 0; i--) {
      if (grid[i][x] === "#" || grid[i][x] === ".") {
        break;
      }
      if (grid[i][x] === "O") {
        boxCount++;
      }
    }

    const posX = x;
    const posY = y - boxCount - 1;

    //if the position is empty, move the player and the boxes
    if (grid[posY][posX] === ".") {
      grid[y][x] = ".";

      grid[posY][posX] = "O";
      grid[y - 1][x] = "@";
      y--;
    }
  } else {
    let boxCount = 0;
    for (let i = y + 1; i < grid.length; i++) {
      if (grid[i][x] === "#" || grid[i][x] === ".") {
        break;
      }
      if (grid[i][x] === "O") {
        boxCount++;
      }
    }

    const posX = x;
    const posY = y + boxCount + 1;

    //if the position is empty, move the player and the boxes
    if (grid[posY][posX] === ".") {
      grid[y][x] = ".";

      grid[posY][posX] = "O";
      grid[y + 1][x] = "@";
      y++;
    }
  }

  //console.log(mov, x, y);
  //print the grid
  for (const row of grid) {
    //console.log(row.join(""));
  }
}

//print the grid
for (const row of grid) {
  //console.log(row.join(""));
}

let score = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "O") {
      score += y * 100 + x;
    }
  }
}
console.log(score);
