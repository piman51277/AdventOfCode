const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));

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
  console.log(x, y);

  if (direction === "up") {
    while (grid[y - 1] && grid[y - 1][x] === ".") {
      y--;

      console.log(x, y);
      visited.add(`${x},${y}`);
    }

    console.log(x, y);

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

//get number of visited positions
console.log(visited.size);

//export the list of visited positions
fs.writeFileSync("visited.txt", Array.from(visited).join("\n"));
