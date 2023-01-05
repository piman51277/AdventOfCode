const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let headx = 500,
  heady = 500;
let tailx = 500,
  taily = 500;

const grid = [];
for (let i = 0; i < 1000; i++) {
  grid[i] = [];
  for (let j = 0; j < 1000; j++) {
    grid[i][j] = 0;
  }
}

grid[tailx][taily] = 1;

for (const line of input) {
  const [direction, distance] = [line[0], parseInt(line.slice(1))];
  switch (direction) {
    case "U":
      for (let i = 0; i < distance; i++) {
        heady++;
        // if tail is more than 1 away from head, move it closer
        while (Math.abs(headx - tailx) > 1 || Math.abs(heady - taily) > 1) {
          if (headx > tailx) tailx++;
          if (headx < tailx) tailx--;
          if (heady > taily) taily++;
          if (heady < taily) taily--;
        }
        grid[tailx][taily] = 1;
      }

      break;
    case "D":
      for (let i = 0; i < distance; i++) {
        heady--;
        // if tail is more than 1 away from head, move it closer
        while (Math.abs(headx - tailx) > 1 || Math.abs(heady - taily) > 1) {
          if (headx > tailx) tailx++;
          if (headx < tailx) tailx--;
          if (heady > taily) taily++;
          if (heady < taily) taily--;
        }
        grid[tailx][taily] = 1;
      }
      break;
    case "R":
      for (let i = 0; i < distance; i++) {
        headx++;
        // if tail is more than 1 away from head, move it closer
        while (Math.abs(headx - tailx) > 1 || Math.abs(heady - taily) > 1) {
          if (headx > tailx) tailx++;
          if (headx < tailx) tailx--;
          if (heady > taily) taily++;
          if (heady < taily) taily--;
        }
        grid[tailx][taily] = 1;
      }
      break;
    case "L":
      for (let i = 0; i < distance; i++) {
        headx--;
        // if tail is more than 1 away from head, move it closer
        while (Math.abs(headx - tailx) > 1 || Math.abs(heady - taily) > 1) {
          if (headx > tailx) tailx++;
          if (headx < tailx) tailx--;
          if (heady > taily) taily++;
          if (heady < taily) taily--;
        }
        grid[tailx][taily] = 1;
      }
      break;
  }
}

// sum the grid
let sum = 0;
for (let i = 0; i < 1000; i++) {
  for (let j = 0; j < 1000; j++) {
    sum += grid[i][j];
  }
}

console.log(sum);
