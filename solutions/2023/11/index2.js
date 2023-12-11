const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

const galaxies = []

//record all psotions of all #
for (let i = 0; i < grid[0].length; i++) {
  for (let j = 0; j < grid.length; j++) {
    if (grid[j][i] === "#") {
      galaxies.push([i, j]);
    }
  }
}

//look for empty rows
for (let y = grid.length - 1; y >= 0; y--) {
  let allDots = true;
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] !== ".") {
      allDots = false;
      break;
    }
  }

  if (allDots) {
    //look for all galaxies with a y value greater than y and add 1000000 to their y value
    for (let g = 0; g < galaxies.length; g++) {
      if (galaxies[g][1] > y) {
        galaxies[g][1] += 1000000 - 1;
      }
    }
  }
}

//look for empty columns
for (let x = grid[0].length - 1; x >= 0; x--) {
  let allDots = true;
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][x] !== ".") {
      allDots = false;
      break;
    }
  }

  if (allDots) {
    //look for all galaxies with a x value greater than x and add 1000000 to their x value
    for (const galaxy of galaxies) {
      if (galaxy[0] > x) {
        galaxy[0] += 1000000 - 1;
      }
    }
  }
}

function shortestPathOnGrid(start, end) {
  const [x1, y1] = start;
  const [x2, y2] = end;

  //this is taxi cab geometry
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


let pathSum = 0;

//for every pair
for (let i = 0; i < galaxies.length; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    pathSum += shortestPathOnGrid(galaxies[i], galaxies[j]);
  }
}

console.log(pathSum);