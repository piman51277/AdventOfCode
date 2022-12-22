const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const grid = [];
const gridHeight = 200;

//input input on the grid = 200 lines long
const width = Math.max(
  ...input.slice(0, gridHeight).map((line) => line.length)
);
const height = input.length;

//start reading the input
for (let y = 0; y < height; y++) {
  grid[y] = [];
  for (let x = 0; x < width; x++) {
    const tile = input[y][x];

    if (tile == undefined || tile == " ") {
      grid[y][x] = -1;
    } else if (tile == "#") {
      grid[y][x] = 1;
    } else if (tile == ".") {
      grid[y][x] = 0;
    }
  }
}

function VectorAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

//get the list of instructions
const instructions = input[gridHeight + 1].split(/(L|R)/g);

//figure out the initial position
const directions = ["up", "left", "down", "right"];
let facing = "right";
//find the x and y of the starting position
let position = [grid[0].indexOf(0), 0];

function visualizeGrid() {
  let output = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x == position[0] && y == position[1]) {
        //add additiona info based on facing
        if (facing == "up") {
          output += "^";
        }
        if (facing == "down") {
          output += "v";
        }
        if (facing == "left") {
          output += "<";
        }
        if (facing == "right") {
          output += ">";
        }
      } else if (grid[y][x] == 1) {
        output += "#";
      } else if (grid[y][x] == 0) {
        output += ".";
      } else if (grid[y][x] == -1) {
        output += " ";
      }
    }
    output += "\n";
  }
  console.log(output);
}

for (const instruction of instructions) {
  if (instruction == "L") {
    facing = directions[(directions.indexOf(facing) + 1) % 4];
    continue;
  } else if (instruction == "R") {
    facing = directions[(directions.indexOf(facing) + 3) % 4];
    continue;
  }

  //it's a move instruction
  const distance = parseInt(instruction);
  let movementDelta;
  if (facing == "up") {
    movementDelta = [0, -1];
  } else if (facing == "down") {
    movementDelta = [0, 1];
  } else if (facing == "left") {
    movementDelta = [-1, 0];
  } else if (facing == "right") {
    movementDelta = [1, 0];
  }

  for (let k = 0; k < distance; k++) {
    //look at the next position
    let tentativePosition = VectorAdd(position, movementDelta);

    //if it's unfloored, do wraparound checks
    if (
      grid[tentativePosition[1]] == undefined ||
      grid[tentativePosition[1]][tentativePosition[0]] == undefined ||
      grid[tentativePosition[1]][tentativePosition[0]] == -1
    ) {
      //we are moving down
      if (facing == "down") {
        //search for the next tile by going up until we hit another non-floor tile
        let safe = tentativePosition;
        while (true) {
          //move up one
          const check = VectorAdd(safe, [0, -1]);

          //if there isn't a empty tile above, we're good
          if (
            grid[check[1]] != undefined &&
            grid[check[1]][check[0]] != -1 &&
            grid[check[1]][check[0]] != undefined
          ) {
            safe = check;
            continue;
          }

          //if there is, we're done
          break;
        }

        //if the next tile is a floor, move there
        if (grid[safe[1]][safe[0]] == 0) {
          position = safe;
          continue;
        } else {
          break;
        }
      }

      //we are moving up
      if (facing == "up") {
        //search for the next tile by going down until we hit another non-floor tile
        let safe = tentativePosition;
        while (true) {
          //move down one
          const check = VectorAdd(safe, [0, 1]);

          //if there isn't a empty tile below, we're good
          if (
            grid[check[1]][check[0]] != -1 &&
            grid[check[1]][check[0]] != undefined
          ) {
            safe = check;
            continue;
          }

          //if there is, we're done
          break;
        }

        //if the next tile is a floor, move there
        if (grid[safe[1]][safe[0]] == 0) {
          position = safe;
          continue;
        } else {
          break;
        }
      }

      //we are moving left
      if (facing == "left") {
        //search for the next tile by going right until we hit another non-floor tile
        let safe = tentativePosition;
        while (true) {
          //move right one
          const check = VectorAdd(safe, [1, 0]);

          //if there isn't a empty tile to the right, we're good
          if (
            grid[check[1]][check[0]] != -1 &&
            grid[check[1]][check[0]] != undefined
          ) {
            safe = check;
            continue;
          }

          //if there is, we're done
          break;
        }

        //if the next tile is a floor, move there
        if (grid[safe[1]][safe[0]] == 0) {
          position = safe;
          continue;
        } else {
          break;
        }
      }

      //we are moving right
      if (facing == "right") {
        //search for the next tile by going left until we hit another non-floor tile
        let safe = tentativePosition;
        while (true) {
          //move left one
          const check = VectorAdd(safe, [-1, 0]);

          //if there isn't a empty tile to the left, we're good
          if (
            grid[check[1]][check[0]] != -1 &&
            grid[check[1]][check[0]] != undefined
          ) {
            safe = check;
            continue;
          }

          //if there is, we're done
          break;
        }

        //if the next tile is a floor, move there
        if (grid[safe[1]][safe[0]] == 0) {
          position = safe;
          continue;
        } else {
          break;
        }
      }
    }

    //if it's a wall, stop
    if (grid[tentativePosition[1]][tentativePosition[0]] == 1) {
      break;
    }

    //if it's a floor, move there
    position = tentativePosition;
  }
}

const finalRow = position[1] + 1;
const finalColumn = position[0] + 1;
const facingValue = ["right", "down", "left", "up"].indexOf(facing);
console.log(1000 * finalRow + 4 * finalColumn + facingValue);
