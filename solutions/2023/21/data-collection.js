const fs = require("fs");
let input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()


const factor = 5;
const mul = (factor / 2) - 0.5;
const mov = mul * 131 + 65


//duplicate every line 5x
input.forEach((line, i) => {
  input[i] = line.repeat(5);
});

let tmp = []

//stak 5 grids on top of each other
tmp = input.slice()
tmp.push(...input)
tmp.push(...input)
tmp.push(...input)
tmp.push(...input)

const grid = tmp.map((line) => line.split(""));

start = [mov, mov];

console.log("start", start);


function getNeighborsLocationWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y] : null,
    x < grid.length - 1 ? [x + 1, y] : null,
    y > 0 ? [x, y - 1] : null,
    y < grid[0].length - 1 ? [x, y + 1] : null,
  ];
  return neighbors.filter(k => k !== null && condition(k[0], k[1]));
}


let queue = [start];
let pointsCopy = []
for (let step = 0; step < mov; step++) {
  let newQueue = new Set();
  for (let i = 0; i < queue.length; i++) {
    let [x, y] = queue[i];
    let neighbors = getNeighborsLocationWithCondition(x, y, (x, y) => {
      return grid[x][y] === "." || grid[x][y] === "S";
    });
    if (neighbors.length > 0) {
      neighbors.forEach((neighbor) => {
        newQueue.add(`${neighbor[0]},${neighbor[1]}`);
      });
    }
  }

  console.log(`step ${step}/${mov} done`);

  queue = []

  //move the queue to the newQueue
  for (let elem of newQueue) {
    queue.push(elem.split(",").map(k => parseInt(k)));
  }

  pointsCopy = [...newQueue]
}


function getCountsforCell(x, y) {
  let actualX = x * 131;
  let actualY = y * 131;

  let count = 0;

  for (let i = actualX; i < actualX + 131; i++) {
    for (let j = actualY; j < actualY + 131; j++) {
      if (pointsCopy.includes(`${i},${j}`)) {
        count++
      }
    }
  }

  return count;
}

console.log("cE 1", getCountsforCell(1, 0));
console.log("cE 1", getCountsforCell(0, 1));
console.log("cE 2", getCountsforCell(0, 3));
console.log("cE 2", getCountsforCell(1, 4));
console.log("cE 3", getCountsforCell(3, 0));
console.log("cE 3", getCountsforCell(4, 1));
console.log("cE 4", getCountsforCell(3, 4));
console.log("cE 4", getCountsforCell(4, 3));

console.log("corner 1", getCountsforCell(2, 0));
console.log("corner 2", getCountsforCell(0, 2));
console.log("corner 3", getCountsforCell(4, 2));
console.log("corner 4", getCountsforCell(2, 4));

console.log("edge 1", getCountsforCell(1, 1));
console.log("edge 2", getCountsforCell(1, 3));
console.log("edge 3", getCountsforCell(3, 1));
console.log("edge 4", getCountsforCell(3, 3));

console.log("int odd", getCountsforCell(2, 2));
console.log("int even", getCountsforCell(1, 2));
console.log("int even", getCountsforCell(2, 1));
console.log("int even", getCountsforCell(2, 3));
console.log("int even", getCountsforCell(3, 2));


//how many points in the entire thing
console.log(pointsCopy.length, "points total for", mov, "steps");
