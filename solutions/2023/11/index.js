const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

//look for empty rows (all .)
const newRows = [];
for (const row of grid) {
  if (row.every((seat) => seat === ".")) {
    newRows.push(row);
    newRows.push(row); // add extra
  } else {
    newRows.push(row);
  }
}



//look for empty columns (all .)
const newGrid = new Array(newRows.length).fill(0).map(() => []);

for (let i = 0; i < newRows[0].length; i++) {
  let allDots = true;
  for (let j = 0; j < newRows.length; j++) {
    if (newRows[j][i] !== ".") {
      allDots = false;
      break;
    }
  }

  if (allDots) {
    for (let j = 0; j < newRows.length; j++) {
      newGrid[j].push(".");
      newGrid[j].push(".");
    }
  } else {
    for (let j = 0; j < newRows.length; j++) {
      newGrid[j].push(newRows[j][i]);
    }
  }
}

const galaxies = []

//find locatins of all #
for (let i = 0; i < newGrid[0].length; i++) {
  for (let j = 0; j < newGrid.length; j++) {
    if (newGrid[j][i] === "#") {
      galaxies.push([i, j]);
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