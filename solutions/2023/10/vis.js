const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

/**
    | is a vertical pipe connecting north and south.
    - is a horizontal pipe connecting east and west.
    L is a 90-degree bend connecting north and east.
    J is a 90-degree bend connecting north and west.
    7 is a 90-degree bend connecting south and west.
    F is a 90-degree bend connecting south and east.
    . is ground; there is no pipe in thsrartis tile.
    S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */


// [N, E, S, W]
const directionMatrix = {
  "|": [1, 0, 1, 0],
  "-": [0, 1, 0, 1],
  "L": [1, 1, 0, 0],
  "J": [1, 0, 0, 1],
  "7": [0, 0, 1, 1],
  "F": [0, 1, 1, 0],
  ".": [0, 0, 0, 0],
  "S": [1, 1, 1, 1]
}


function getNeighborsCoords(x, y) {
  //is the current cell S?
  if (grid[y][x] === "S") {
    //if so, return all neighbors that would return back to S
    const left = x - 1 >= 0 && directionMatrix[grid[y][x - 1]][1] === 1;
    const right = x + 1 < grid.length && directionMatrix[grid[y][x + 1]][3] === 1;
    const up = y - 1 >= 0 && directionMatrix[grid[y - 1][x]][2] === 1;
    const down = y + 1 < grid[x].length && directionMatrix[grid[y + 1][x]][0] === 1;

    const neighbors = [];
    if (left) neighbors.push({ x: x - 1, y });
    if (right) neighbors.push({ x: x + 1, y });
    if (up) neighbors.push({ x, y: y - 1 });
    if (down) neighbors.push({ x, y: y + 1 });

    return neighbors;

  }


  const neighbors = [];

  const matrix = directionMatrix[grid[y][x]];


  //each one tells us if we can go N E S w

  if (matrix[0] === 1 && y - 1 >= 0) {
    neighbors.push({ x, y: y - 1 });
  }

  if (matrix[1] === 1 && x + 1 < grid.length) {
    neighbors.push({ x: x + 1, y });
  }

  if (matrix[2] === 1 && y + 1 < grid[x].length) {
    neighbors.push({ x, y: y + 1 });
  }

  if (matrix[3] === 1 && x - 1 >= 0) {
    neighbors.push({ x: x - 1, y });
  }

  return neighbors;
}


const visited = new Set();
//get location of s
const startY = grid.findIndex((row) => row.includes("S"));
const startX = grid[startY].findIndex((cell) => cell === "S");

async function dfs(x, y, depth, path) {

  if (grid[y][x] === "S" && depth > 0) {
    return [depth + 1, path];
  }

  if (visited.has(`${x},${y}`)) return [0, path]

  visited.add(`${x},${y}`);

  const neighbors = getNeighborsCoords(x, y);
  let maxDepth = 0;
  let maxPath = path;
  for (const neighbor of neighbors) {
    const neighborStr = `${neighbor.x},${neighbor.y}`;
    const [childDepth, childPath] = await new Promise((resolve) => {
      setImmediate(() =>
        resolve(dfs(neighbor.x, neighbor.y, depth + 1, path + "->" + neighborStr))
      );
    });
    if (childDepth > maxDepth) {
      maxDepth = childDepth;
      maxPath = childPath;
    }
  }

  return [maxDepth, maxPath];
}

function getPathChar(x, y) {
  switch (grid[y][x]) {
    case "L":
      return "╚"
    case "J":
      return "╝"
    case "7":
      return "╗"
    case "F":
      return "╔"
    case "S":
    case "|":
      return "║"
    case "-":
      return "═"
    default:
      return " ";
  }
}

function getNeighborsNoRestrictions(x, y) {
  const neighbors = [];

  if (y - 1 >= 0) {
    neighbors.push({ x, y: y - 1 });
  }

  if (x + 1 < grid[y].length) {
    neighbors.push({ x: x + 1, y });
  }

  if (y + 1 < grid.length) {
    neighbors.push({ x, y: y + 1 });
  }

  if (x - 1 >= 0) {
    neighbors.push({ x: x - 1, y });
  }

  return neighbors;
}


async function main() {

  const loop = await dfs(startX, startY, 0, `${startX},${startY}`);

  const [depth, path] = loop;

  const pathElements = path.split("->");


  //make a grid matching the size of the input
  const grid2 = [];
  for (let i = 0; i < grid.length; i++) {
    grid2.push(new Array(grid[i].length).fill(0));
  }

  //fill in the path
  for (const pathElement of pathElements) {
    const [x, y] = pathElement.split(",").map((x) => parseInt(x));
    grid2[y][x] = 1;
  }

  //from outside edges flood fill with 2
  const queue = [];
  const visited = new Set();

  //get all the outside edges
  for (let i = 0; i < grid2.length; i++) {
    if (grid2[i][0] === 0) {
      queue.push({ x: 0, y: i });
    }
    if (grid2[i][grid2[i].length - 1] === 0) {
      queue.push({ x: grid2[i].length - 1, y: i });
    }
  }

  for (let i = 0; i < grid2[0].length; i++) {
    if (grid2[0][i] === 0) {
      queue.push({ x: i, y: 0 });
    }
    if (grid2[grid2.length - 1][i] === 0) {
      queue.push({ x: i, y: grid2.length - 1 });
    }
  }

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (visited.has(`${x},${y}`)) continue;
    visited.add(`${x},${y}`);
    if (grid2[y][x] === 1) continue;

    grid2[y][x] = 2;

    const neighbors = getNeighborsNoRestrictions(x, y);

    for (const neighbor of neighbors) {
      queue.push(neighbor);
    }
  }



  let area = 0;
  let ValidCoors = [];

  for (let y = 0; y < grid2.length; y++) {
    for (let x = 0; x < grid2[y].length; x++) {
      if (grid2[y][x] === 0) {
        let isValid = true;
        let upwalls = 0;
        let downwalls = 0;

        //start scanning to the left
        let left = x;
        while (left >= 0) {
          const gridElem = grid[y][left];

          //if we hit a 2, we are done
          if (grid2[y][left] === 2) {
            break;
          }

          //is this part of the loop?
          if (!pathElements.includes(`${left},${y}`)) {
            left--;
            continue;
          }
          left--;

          //id its a |, 
          if (gridElem === "|") {
            upwalls++;
            downwalls++;
          }
          if (gridElem === "L" || gridElem === "J") {
            upwalls++;
          }
          if (gridElem === "7" || gridElem === "F") {
            downwalls++;
          }

        }

        //if either up or down walls is 0, its not valid
        if (upwalls === 0 || downwalls === 0) {
          isValid = false;
        }

        else if (downwalls % 2 != 1 || upwalls % 2 != 1) {
          isValid = false;
        }

        if (isValid) {
          ValidCoors.push({ x, y });
          grid2[y][x] = 3;
          area++;
        } else {
          grid2[y][x] = 6;

        }
      }
    }
  }


  //print the grid
  for (let y = 0; y < grid2.length; y++) {
    let row = "";
    for (let x = 0; x < grid2[y].length; x++) {
      if (grid2[y][x] === 1) {
        row += getPathChar(x, y);
      }
      else if (grid2[y][x] === 3) {
        //make this green
        row += "\x1b[32m▓\x1b[0m";
      }
      else {
        //make this red
        row += "\x1b[31m╳\x1b[0m";
      }
    }
    console.log(row);
  }

}

main();