const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

const width = 71;
const height = 71;

const corrupted = [];

for (const line of input) {
  const [x, y] = line.split(",").map(Number);
  corrupted.push([x, y]);
}

function simSteps(k) {
  const grid = new Array(width).fill(0).map(() => new Array(height).fill(0));

  //add the first k corrupted cells
  for (let i = 0; i < k; i++) {
    //console.log(corrupted[i]);
    grid[corrupted[i][0]][corrupted[i][1]] = 1;
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

  //start at 0,0 get to width-1, height-1
  const distances = new Array(width)
    .fill(0)
    .map(() => new Array(height).fill(Infinity));

  distances[0][0] = 0;

  //dijkstra
  let queue = [[0, 0, 0]]; //x,y,dist
  while (queue.length > 0) {
    const [x, y, dist] = queue.shift();

    if (x === width - 1 && y === height - 1) {
      return dist;
    }

    const neighbors = getNeighborsLocationWithCondition(
      x,
      y,
      (x, y, value) => value === 0
    );
    for (const [nx, ny] of neighbors) {
      if (distances[ny][nx] > dist + 1) {
        distances[ny][nx] = dist + 1;
        queue.push([nx, ny, dist + 1]);
      }
    }

    //sort by distance
    queue.sort((a, b) => a[2] - b[2]);
  }
}

for (let i = 0; i < corrupted.length; i++) {
  const res = simSteps(i);
  if (res == undefined) {
    console.log(corrupted[i - 1]);
    break;
  }
}
