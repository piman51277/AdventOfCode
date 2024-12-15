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

for (let i = 0; i < 10402; i++) {
  //for each robot
  for (let k = 0; k < robots.length; k++) {
    const robot = robots[k];
    robot.px += robot.vx;
    robot.py += robot.vy;

    //if we went off a grid, wrap around
    if (robot.px < 0) robot.px += grid_width;
    if (robot.px >= grid_width) robot.px -= grid_width;
    if (robot.py < 0) robot.py += grid_height;
    if (robot.py >= grid_height) robot.py -= grid_height;
  }

  //check if every tile has at most one robot
  const occupied = new Set();
  for (const robot of robots) {
    occupied.add(robot.px + "," + robot.py);
  }
  if (occupied.size != robots.length) {
    continue;
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
  console.log(i + 1);
}
