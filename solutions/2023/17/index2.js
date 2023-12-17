const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split("").map(Number));

/**
 * Get the location of neighbors of a cell
 * @param {number} x 
 * @param {number} y 
 */
function getNeighborsLocation(x, y) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y, 3] : null,
    x < grid.length - 1 ? [x + 1, y, 1] : null,
    y > 0 ? [x, y - 1, 0] : null,
    y < grid[0].length - 1 ? [x, y + 1, 2] : null,
  ];
  return neighbors.filter(k => k !== null);
}


//implementing dijiikstra's algorithm
const distances = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
const queue = [];
const visited = new Set();

//x, y, lastDirection, distance since last turn, distance from start
//direction enum
//0 = up
//1 = right
//2 = down
//3 = left

const opp = [2, 3, 0, 1];

const start = [[0, 0, 1, 1, 0], [0, 0, 2, 1, 0]];
distances[0][0] = 0;
queue.push(...start);
while (queue.length > 0) {
  const [x, y, lastDirection, distance, totDist] = queue.shift();

  const id = `${x},${y},${lastDirection},${distance}`;
  if (visited.has(id)) {
    continue;
  }
  visited.add(id);

  //updare distance
  //is the the bottom corner?
  if (x === grid.length - 1 && y === grid[0].length - 1) {

    //only apply if the distance is greather than 3
    if (distance > 3) {
      distances[x][y] = Math.min(distances[x][y], totDist);
    } else {

      //just kill this path
      continue;
    }
  }
  else {

    distances[x][y] = Math.min(distances[x][y], totDist);
  }

  const neighbors = getNeighborsLocation(x, y);

  const toAdd = []
  for (const [nx, ny, direction] of neighbors) {

    const distanceToNeighbor = grid[nx][ny]

    if (distance < 4) {
      if (lastDirection === direction) {
        const newDistance = totDist + distanceToNeighbor;
        toAdd.push([nx, ny, direction, distance + 1, newDistance]);
      }
      continue;
    }

    //are we going straight?
    if (lastDirection === direction) {
      //is going straight possible?
      if (distance < 10) {
        const newDistance = totDist + distanceToNeighbor;
        toAdd.push([nx, ny, direction, distance + 1, newDistance]);
      }
    }

    //we can't go back
    else if (direction === opp[lastDirection]) {
      continue;
    }

    else {
      //we are turning
      const newDistance = totDist + distanceToNeighbor;
      toAdd.push([nx, ny, direction, 1, newDistance]);

    }
  }

  //assume queue is already sorted low->high totDist

  //sort toAdd
  toAdd.sort((a, b) => a[4] - b[4]);

  //insert toAdd into queue
  let pointer = 0;
  for (let i = 0; i < toAdd.length; i++) {
    //first for first value greater than toAdd[i]
    while (pointer < queue.length && queue[pointer][4] < toAdd[i][4]) {
      pointer++;
    }
    queue.splice(pointer, 0, toAdd[i]);
  }

}


console.log(distances[grid.length - 1][grid[0].length - 1]);

