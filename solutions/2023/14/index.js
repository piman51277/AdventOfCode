const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map(row => row.split(""));


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

console.log(grid.map(row => row.join("")).join("\n"));

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