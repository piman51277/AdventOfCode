const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const grid = input.map((line) => line.split(""));

let visible = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));

//checking rows first

for (let y = 0; y < grid.length; y++) {
  let workingHigh = 0;
  for (let x = 0; x < grid[y].length; x++) {

    //if on the edge, then it's visible
    if (x === 0 || x === grid[y].length - 1) {
      visible[x][y] = 1;
    }
    else if (grid[y][x] > workingHigh) {
      visible[x][y] = 1;
    }


    workingHigh = Math.max(workingHigh, grid[y][x]);
  }

  //from the other side
  workingHigh = 0;
  for (let x = grid[y].length - 1; x >= 0; x--) {
    if (grid[y][x] > workingHigh) {
      visible[x][y] = 1;
    }

    workingHigh = Math.max(workingHigh, grid[y][x]);
  }

}

//checking cols
for(let x = 0; x < grid[0].length; x++){
  let workingHigh = 0;
  for(let y = 0; y < grid.length; y++){
    if(y === 0 || y === grid.length - 1){
      visible[x][y] = 1;
    }
    else if(grid[y][x] > workingHigh){
      visible[x][y] = 1;
    }

    workingHigh = Math.max(workingHigh, grid[y][x]);
  }

  //from the other side
  workingHigh = 0;
  for (let y = grid.length - 1; y >= 0; y--){
    if (grid[y][x] > workingHigh) {
      visible[x][y] = 1;
    }

    workingHigh = Math.max(workingHigh, grid[y][x]);
  }
}

//sum up the visible
let sum = 0;
for (let y = 0; y < visible.length; y++){
  for(let x = 0; x < visible[y].length; x++){
    sum += visible[x][y];
  }
}
console.log(sum);