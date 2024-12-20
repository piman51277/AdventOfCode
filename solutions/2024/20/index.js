const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

let startPos = { x: 0, y: 0 };
let endPos = { x: 0, y: 0 };
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === "S") {
      startPos = { x, y };
    } else if (grid[y][x] === "E") {
      endPos = { x, y };
    }
  }
}

function getNeighborsLocationWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y] : null,
    x < grid[0].length - 1 ? [x + 1, y] : null,
    y > 0 ? [x, y - 1] : null,
    y < grid.length - 1 ? [x, y + 1] : null,
    //diag
    x > 0 && y > 0 ? [x - 1, y - 1] : null,
    x > 0 && y < grid.length - 1 ? [x - 1, y + 1] : null,
    x < grid[0].length - 1 && y > 0 ? [x + 1, y - 1] : null,
    x < grid[0].length - 1 && y < grid.length - 1 ? [x + 1, y + 1] : null,
  ];
  return neighbors.filter(
    (k) => k !== null && condition(k[0], k[1], grid[k[1]][k[0]])
  );
}

const pathPositions = [];
const visited = new Set();
const queue = [{ ...startPos }];
while (queue.length > 0) {
  const { x, y } = queue.shift();
  pathPositions.push({ x, y });

  //if its the end,stop
  if (x === endPos.x && y === endPos.y) {
    break;
  }

  //mark as visited
  visited.add(`${x},${y}`);

  const nei = getNeighborsLocationWithCondition(x, y, (x, y, v) => {
    return v !== "#" && !visited.has(`${x},${y}`);
  });

  queue.push({ x: nei[0][0], y: nei[0][1] });
}

let skips = 0;
let savedArr = {};
for (let firstPos = 0; firstPos < pathPositions.length - 1; firstPos++) {
  for (
    let secondPos = firstPos + 1;
    secondPos < pathPositions.length;
    secondPos++
  ) {
    const savedBySkipping = secondPos - firstPos;

    //check if they have the same x or y
    if (
      pathPositions[firstPos].x === pathPositions[secondPos].x ||
      pathPositions[firstPos].y === pathPositions[secondPos].y
    ) {
      //check if they are 3 units or less away
      let xDiff = Math.abs(
        pathPositions[firstPos].x - pathPositions[secondPos].x
      );
      let yDiff = Math.abs(
        pathPositions[firstPos].y - pathPositions[secondPos].y
      );

      if (xDiff + yDiff <= 2) {
        const saved = savedBySkipping - (xDiff + yDiff);

        //if (saved > 0) console.log("saved", saved);

        savedArr[saved] = savedArr[saved] ? savedArr[saved] + 1 : 1;
        if (saved >= 100) {
          skips++;
          //start a frequency counter
        }
      }
    }
  }
}

console.log(skips);
//console.log(savedArr);
