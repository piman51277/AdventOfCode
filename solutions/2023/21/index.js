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
for (let step = 0; step < 64; step++) {
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

  queue = []

  //move the queue to the newQueue
  for (let elem of newQueue) {
    queue.push(elem.split(",").map(k => parseInt(k)));
  }

  pointsCopy = [...newQueue]
}


//how many points in the entire thing
console.log(pointsCopy.length);
