const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

let pos = { x: 0, y: 0 };
//look for E
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === "S") {
      pos = { x, y };
      break;
    }
  }
}

//look for S
let goal = { x: 0, y: 0 };
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === "E") {
      goal = { x, y };
      break;
    }
  }
}

/**
 * Get the location of all neighbors that meet a certain condition
 * X is COL #, Y is ROW #
 * @param {number} x
 * @param {number} y
 * @param {(x, y, value) => bool} condition - function that returns true if the cell meets the condition
 */
function getNeighborsLocationWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y] : null,
    x < grid[0].length - 1 ? [x + 1, y] : null,
    y > 0 ? [x, y - 1] : null,
    y < grid.length - 1 ? [x, y + 1] : null,
  ];
  return neighbors.filter(
    (k) => k !== null && condition(k[0], k[1], grid[k[1]][k[0]])
  );
}

const directions = [
  [0, 1], //right
  [1, 0], //down
  [0, -1], //left
  [-1, 0], //up
];

//copy the grid to give tile values
let gridCopy = grid.map((row) =>
  row.map((_) => Array.from({ length: 4 }, () => [Infinity, 0]))
);

//dfs
let stack = [[pos, 1, 0, []]];
let visited = new Set();

let endsMinScore = Infinity;
let ends = [];

let processed = 0;

while (stack.length > 0) {
  processed++;
  let [position, direction, score, working] = stack.pop();
  //console.log(position, direction, score);
  if (processed % 1000 === 0) {
    console.log(processed, stack.length);
  }

  //if this is the end position add it to the ends
  if (position.x === goal.x && position.y === goal.y) {
    if (score < endsMinScore) {
      console.log("NEW MIN", score);
      ends = [];
      ends.push([score, working]);
      endsMinScore = score;
    } else if (score === endsMinScore) {
      console.log("EQ MIN", score);
      ends.push([score, working]);
    } else {
      console.log("REJECT", score);
    }

    continue;
  }

  if (visited.has(`${position.x},${position.y},${direction}`)) {
    const [currentLowest, multiplicity] =
      gridCopy[position.y][position.x][direction];

    if (score > currentLowest) {
      //console.log("SKIP", gridCopy[position.y][position.x], score);
      continue;
    } else if (score === currentLowest) {
      gridCopy[position.y][position.x][direction] = [score, multiplicity + 1];
      //continue;
    } else {
      gridCopy[position.y][position.x][direction] = [score, 1];
    }
  } else {
    gridCopy[position.y][position.x][direction] = [score, 1];
    visited.add(`${position.x},${position.y},${direction}`);
  }

  //console.log("NEIGHBORS");
  const neighbors = getNeighborsLocationWithCondition(
    position.x,
    position.y,
    (x, y, value) => value !== "#"
  );

  for (let neighbor of neighbors) {
    let [x, y] = neighbor;
    let neighborScore = score + 1;

    //figure out displacement of the neighbor
    let dx = x - position.x;
    let dy = y - position.y;

    //index of the direction
    let index = directions.findIndex((d) => d[0] === dx && d[1] === dy);

    //how many times we have to turn (mod 4)
    let turnRight = (index - direction + 4) % 4;
    let turnLeft = (direction - index + 4) % 4;

    let turn = Math.min(turnRight, turnLeft);

    neighborScore += turn * 1000;

    stack.push([{ x, y }, index, neighborScore, [...working, `${x},${y}`]]);
    //console.log([{ x, y }, index, neighborScore]);
  }
}

let inEnds = new Set();
console.log(ends);

for (let end of ends) {
  let [score, working] = end;
  for (let entry of working) {
    let [x, y] = entry.split(",").map((x) => parseInt(x));
    //console.log(x, y);
    inEnds.add(`${x},${y}`);
  }
}

console.log(inEnds.size + 1);
