const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

const grid_width = 101;
const grid_height = 103;

const robots = [];

for (const line of input) {
  //example line p=0,4 v=3,-3
  const reg = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;
  const match = line.match(reg);
  const [_, px, py, vx, vy] = [...match];
  robots.push({
    px: parseInt(px),
    py: parseInt(py),
    vx: parseInt(vx),
    vy: parseInt(vy),
  });
}

for (let i = 0; i < 100; i++) {
  //for each robot
  for (const robot of robots) {
    robot.px += robot.vx;
    robot.py += robot.vy;

    //if we went off a grid, wrap around
    if (robot.px < 0) robot.px += grid_width;
    if (robot.px >= grid_width) robot.px -= grid_width;
    if (robot.py < 0) robot.py += grid_height;
    if (robot.py >= grid_height) robot.py -= grid_height;
  }
}

let countLQ = 0;
let countRQ = 0;
let countUQ = 0;
let countDQ = 0;
for (const robot of robots) {
  if (robot.px < grid_width / 2 - 1 && robot.py < grid_height / 2 - 1) {
    countLQ++;
  }
  if (robot.px > grid_width / 2 && robot.py < grid_height / 2 - 1) {
    countRQ++;
  }
  if (robot.px < grid_width / 2 - 1 && robot.py > grid_height / 2) {
    countUQ++;
  }
  if (robot.px > grid_width / 2 && robot.py > grid_height / 2) {
    countDQ++;
  }
}

//print out eh grid
for (let y = 0; y < grid_height; y++) {
  for (let x = 0; x < grid_width; x++) {
    let found = false;
    for (const robot of robots) {
      if (robot.px === x && robot.py === y) {
        process.stdout.write("#");
        found = true;
        break;
      }
    }
    if (!found) {
      process.stdout.write(".");
    }
  }
  process.stdout.write("\n");
}

console.log(countLQ, countRQ, countUQ, countDQ);
console.log(countLQ * countRQ * countUQ * countDQ);
