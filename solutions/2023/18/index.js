const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const entries = input.map((entry) => {
  const [dir, length, colorRaw] = entry.split(" ");

  const color = colorRaw.replace("(#", "").replace(")", "");

  return { dir, length: parseInt(length), color }
});

//count the sum of entries that go U
const up = entries.filter((entry) => entry.dir === "U").reduce((acc, entry) => acc + entry.length, 0);
const down = entries.filter((entry) => entry.dir === "D").reduce((acc, entry) => acc + entry.length, 0);
const left = entries.filter((entry) => entry.dir === "L").reduce((acc, entry) => acc + entry.length, 0);
const right = entries.filter((entry) => entry.dir === "R").reduce((acc, entry) => acc + entry.length, 0);

const height = Math.abs(up);
const width = Math.abs(right);

//create the grid(2d array)
const grid = Array.from({ length: height * 2 + 1 }, () => Array.from({ length: width * 2 + 1 }, () => 0));


//set the starting point to the middle of the grid
let x = Math.floor(width * 1.5);
let y = Math.floor(height * 1.5)

for (const entry of entries) {
  const { dir, length, color } = entry;

  //if the direction is up, go up
  if (dir === "U") {
    for (let i = 0; i < length; i++) {
      grid[y][x] = 1;
      y--;
    }
  }
  else if (dir === "D") {
    for (let i = 0; i < length; i++) {
      grid[y][x] = 1;
      y++;
    }
  }
  else if (dir === "L") {
    for (let i = 0; i < length; i++) {
      grid[y][x] = 1;
      x--;
    }
  }
  else if (dir === "R") {
    for (let i = 0; i < length; i++) {
      grid[y][x] = 1;
      x++;
    }
  }
}


//flood fill from the corner
let count = 0;
const visited = new Set();
let queue = [[0, 0]];
while (queue.length > 0) {
  const [x, y] = queue.shift();

  if (visited.has(`${x},${y}`)) continue;
  visited.add(`${x},${y}`);

  //check in bounds
  if (x < 0 || x >= grid[0].length) continue;
  if (y < 0 || y >= grid.length) continue;

  const color = grid[y][x];
  if (color === 1) continue;


  count++;

  queue.push([x + 1, y]);
  queue.push([x - 1, y]);
  queue.push([x, y + 1]);
  queue.push([x, y - 1]);
}

console.log(((width * 2 + 1) * (height * 2 + 1)) - count);