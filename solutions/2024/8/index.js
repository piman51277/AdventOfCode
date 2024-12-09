const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length - 1;
const width = grid[0].length;

const attennaLocs = {};
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] !== ".") {
      const freq = grid[y][x];

      if (!attennaLocs[freq]) {
        attennaLocs[freq] = [];
      }
      attennaLocs[freq].push({ x, y });
    }
  }
}

function dist(a, b, x, y) {
  return Math.sqrt((a - x) * (a - x) + (b - y) * (b - y));
}

let antiCount = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    let isAnti = false;
    for (const freq in attennaLocs) {
      const locs = attennaLocs[freq];

      console.log("Checking freq:", freq, "at", x, y);

      //pick two and draw a line through them
      for (let i = 0; i < locs.length; i++) {
        for (let j = i + 1; j < locs.length; j++) {
          const a = locs[i];
          const b = locs[j];

          //the point we pick can't be on one of the attenna
          if (a.x == x && a.y == y) {
            continue;
          }
          if (b.x == x && b.y == y) {
            continue;
          }

          //check if x,y is on the line
          const d1 = dist(a.x, a.y, x, y);
          const d2 = dist(b.x, b.y, x, y);
          const d3 = dist(a.x, a.y, b.x, b.y);

          const maxVal = Math.max(d1, d2, d3);
          const otherSum = d1 + d2 + d3 - maxVal;

          if (maxVal === otherSum) {
            //we are on the line

            if (d1 == d3 || d2 == d3) {
              //we are on the line and on the point
              isAnti = true;

              //print out the grid
              console.log("Freq:", freq, maxVal, otherSum);
              console.log("Grid:");
              const temp = grid[y][x];
              grid[y][x] = "#";
              for (let y = 0; y < height; y++) {
                console.log(grid[y].join(""));
              }
              grid[y][x] = temp;
              break;
            }
          }

          if (isAnti) {
            break;
          }
        }
        if (isAnti) {
          break;
        }
      }
      if (isAnti) {
        break;
      }
    }

    if (isAnti) {
      console.log(x, y);
      antiCount++;
    }
  }
}

console.log(antiCount);
