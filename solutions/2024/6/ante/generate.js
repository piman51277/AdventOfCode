function hasLoop(grid) {
  grid = JSON.parse(JSON.stringify(grid));

  let pos = { x: 0, y: 0 };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        pos.x = x;
        pos.y = y;

        //remove the starting position
        grid[y][x] = ".";

        break;
      }
    }
  }

  const visited = new Set();

  let direction = "up";
  visited.add(`${pos.x},${pos.y}`);

  let overlapCount = 0;

  while (true) {
    //get the current position
    let x = pos.x;
    let y = pos.y;

    if (direction === "up") {
      while (grid[y - 1] && grid[y - 1][x] !== "#") {
        y--;
      }

      //if we hit the edge, break
      if (y == 0) {
        return false;
      }

      //otherwise turn right
      direction = "right";
    } else if (direction === "down") {
      while (grid[y + 1] && grid[y + 1][x] !== "#") {
        y++;
      }

      if (y >= grid.length - 1) {
        return false;
      }

      direction = "left";
    } else if (direction === "left") {
      while (grid[y][x - 1] && grid[y][x - 1] !== "#") {
        x--;
      }

      if (x == 0) {
        return false;
      }

      direction = "up";
    } else if (direction === "right") {
      while (grid[y][x + 1] && grid[y][x + 1] !== "#") {
        x++;
      }

      if (x >= grid[y].length - 1) {
        return false;
      }

      direction = "down";
    }

    if (visited.has(`${x},${y}`)) {
      overlapCount++;
    }
    visited.add(`${x},${y}`);

    if (overlapCount > 10) {
      return true;
    }

    pos.x = x;
    pos.y = y;
  }
}

function p1(grid) {
  grid = JSON.parse(JSON.stringify(grid));
  const visited = new Set();

  let pos = { x: 0, y: 0 };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        pos.x = x;
        pos.y = y;

        //remove the starting position
        grid[y][x] = ".";

        break;
      }
    }
  }
  let direction = "up";
  visited.add(`${pos.x},${pos.y}`);

  while (true) {
    //get the current position
    let x = pos.x;
    let y = pos.y;

    if (direction === "up") {
      while (grid[y - 1] && grid[y - 1][x] === ".") {
        y--;
        visited.add(`${x},${y}`);
      }

      //if we hit the edge, break
      if (!grid[y - 1]) {
        break;
      }

      //otherwise turn right
      direction = "right";
    } else if (direction === "down") {
      while (grid[y + 1] && grid[y + 1][x] === ".") {
        y++;
        visited.add(`${x},${y}`);
      }

      if (!grid[y + 1]) {
        break;
      }

      direction = "left";
    } else if (direction === "left") {
      while (grid[y][x - 1] && grid[y][x - 1] === ".") {
        x--;
        visited.add(`${x},${y}`);
      }

      if (!grid[y][x - 1]) {
        break;
      }

      direction = "up";
    } else if (direction === "right") {
      while (grid[y][x + 1] && grid[y][x + 1] === ".") {
        x++;
        visited.add(`${x},${y}`);
      }

      if (!grid[y][x + 1]) {
        break;
      }

      direction = "down";
    }

    visited.add(`${x},${y}`);

    pos.x = x;
    pos.y = y;
  }

  return visited.size;
}

const fs = require("fs");

let attempt = 0;

const size = 8000;

while (true) {
  //genertate a grid of sizexsize
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ".")
  );

  const numWalls = size * size * 0.005;

  //add 2000 random walls
  for (let i = 0; i < numWalls; i++) {
    grid[Math.floor(Math.random() * size)][Math.floor(Math.random() * size)] =
      "#";
  }

  //add the starting position
  grid[Math.floor(Math.random() * size)][Math.floor(Math.random() * size)] =
    "^";

  if (hasLoop(grid)) {
    console.log(`Attempt ${attempt++}: LOOP`);
    continue;
  }

  const covered = p1(grid);

  console.log(`Attempt ${attempt++}: ${covered}`);

  if (covered > 100000) {
    fs.writeFileSync("grid.txt", grid.map((row) => row.join("")).join("\n"));
    break;
  }
}
