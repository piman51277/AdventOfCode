const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

let grid = input.map(row => row.split(""));

const crypto = require("crypto");
function hashGrid(grid) {
  //sha256 hash
  const hash = crypto.createHash("sha256");
  return hash.update(grid.map(row => row.join("")).join("\n")).digest("hex");
}

function iterateGrid(grid, direction) {
  if (direction == "north") {
    //start at the top row
    for (let y = 0; y < grid.length; y++) {
      //look for any Os 
      for (let x = 0; x < grid[y].length; x++) {

        if (grid[y][x] === "O") {
          //if you find one, start scanning upwards
          for (let i = y - 1; i >= 0; i--) {
            //if you find a # or a O, stop scanning
            if (grid[i][x] === "#" || grid[i][x] === "O") {
              //move the O to here
              grid[y][x] = ".";
              grid[i + 1][x] = "O";
              break;
            }

            if (i === 0) {
              grid[y][x] = ".";
              grid[0][x] = "O";
              break;
            }
          }
        }
      }
    }

    return grid;
  }

  else if (direction == "south") {
    //start from the bottom 
    for (let y = grid.length - 1; y >= 0; y--) {
      //look for any Os 
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === "O") {
          //if you find one, start scanning upwards
          for (let i = y + 1; i < grid.length; i++) {
            //if you find a # or a O, stop scanning
            if (grid[i][x] === "#" || grid[i][x] === "O") {
              //move the O to here
              grid[y][x] = ".";
              grid[i - 1][x] = "O";
              break;
            }

            if (i === grid.length - 1) {
              grid[y][x] = ".";
              grid[grid.length - 1][x] = "O";
              break;
            }
          }
        }
      }
    }

    return grid;
  }

  else if (direction == "east") {
    //start from the right
    for (let x = grid[0].length - 1; x >= 0; x--) {
      //look for any Os 
      for (let y = 0; y < grid.length; y++) {
        if (grid[y][x] === "O") {
          //if you find one, start scanning upwards
          for (let i = x + 1; i < grid[y].length; i++) {
            //if you find a # or a O, stop scanning
            if (grid[y][i] === "#" || grid[y][i] === "O") {
              //move the O to here
              grid[y][x] = ".";
              grid[y][i - 1] = "O";
              break;
            }

            if (i === grid[y].length - 1) {
              grid[y][x] = ".";
              grid[y][grid[y].length - 1] = "O";
              break;
            }
          }
        }
      }
    }
  }


  else {
    //start from the left
    for (let x = 0; x < grid[0].length; x++) {
      //look for any Os 
      for (let y = 0; y < grid.length; y++) {
        if (grid[y][x] === "O") {
          //if you find one, start scanning upwards
          for (let i = x - 1; i >= 0; i--) {
            //if you find a # or a O, stop scanning
            if (grid[y][i] === "#" || grid[y][i] === "O") {
              //move the O to here
              grid[y][x] = ".";
              grid[y][i + 1] = "O";
              break;
            }

            if (i === 0) {
              grid[y][x] = ".";
              grid[y][0] = "O";
              break;
            }
          }
        }
      }
    }

  }


}


function performCycle(grid) {

  iterateGrid(grid, "north");
  iterateGrid(grid, "west");
  iterateGrid(grid, "south");
  iterateGrid(grid, "east");

  return grid;
}


const seenStorage = new Set();
const seenStorageMap = new Map();
for (let i = 0; i < 1000000000; i++) {
  grid = performCycle(grid);

  const hash = hashGrid(grid);
  if (seenStorage.has(hash)) {
    console.log("Found a loop!");
    const loopOrigin = seenStorageMap.get(hash);
    const loopLength = i - loopOrigin;

    const remaining = 1000000000 - 1 - i;
    const remainingMod = remaining % loopLength;

    console.log(loopOrigin, loopLength, remaining, remainingMod);

    for (let j = 0; j < remainingMod; j++) {
      performCycle(grid);
    }

    let sum = 0;

    //start from the bottom 
    for (let y = grid.length - 1; y >= 0; y--) {
      //look for any Os 
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === "O") {
          sum += (grid.length - y)
        }
      }
    }

    console.log(sum);

    break;
  }
  seenStorage.add(hash);
  seenStorageMap.set(hash, i);
}

console.log(grid.map(row => row.join("")).join("\n"));