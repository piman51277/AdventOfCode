const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

const zeroPos = [];

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    if (grid[i][j] === "0") {
      zeroPos.push([i, j]);
    }
  }
}
console.log(`Found ${zeroPos.length} candidate trailheads`);

/**
 * Get the location of all neighbors that meet a certain condition
 * @param {number} x
 * @param {number} y
 * @param {(x, y, value) => bool} condition - function that returns true if the cell meets the condition
 */
function getNeighborsLocationWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y] : null,
    x < grid.length - 1 ? [x + 1, y] : null,
    y > 0 ? [x, y - 1] : null,
    y < grid[0].length - 1 ? [x, y + 1] : null,
  ];
  return neighbors.filter(
    (k) => k !== null && condition(k[0], k[1], grid[k[1]][k[0]])
  );
}

let scoreSums = 0;
for (const [x, y] of zeroPos) {
  let score = 0;
  let visited = new Set();
  const queue = [[x, y, 0]];
  while (queue.length > 0) {
    //pop the first element
    const [i, j, dist] = queue.shift();

    //have we been here before?
    if (visited.has(`${i},${j}`)) {
      continue;
    }
    visited.add(`${i},${j}`);

    //console.log(queue);
    //console.log(visited);

    //if the value is a 9, add it to the score
    if (grid[i][j] === "9") {
      score += 1;
      continue;
    }

    const neighbors = getNeighborsLocationWithCondition(
      j,
      i,
      (_, _0, value) => {
        console.log(value);
        return parseInt(value) == dist + 1;
      }
    );

    console.log(
      `Visiting ${i},${j} with value ${
        grid[j][i]
      } and neighbors ${neighbors.join(";")}`
    );

    for (const [ni, nj] of neighbors) {
      //console.log(`Adding ${ni},${nj} to the queue for ${dist + 1}`);
      queue.push([nj, ni, dist + 1]);
    }
  }

  console.log(`Score for trailhead at ${x},${y}: ${score}`);

  scoreSums += score;
}

console.log(`Total score: ${scoreSums}`);
