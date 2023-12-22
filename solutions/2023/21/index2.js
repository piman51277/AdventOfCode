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

const startX = 65;

const desiredSteps = 26501365;

//tiles are 131x131
const gridSide = 131;

//this is how many complete tiles are from the edge of the start tile to to the very edge
const acrossArm = Math.floor((desiredSteps - startX) / gridSide) - 1;
const diag = acrossArm * 2 + 1
//compute the inner core

//first is a algebraic sequence 8, 16, 24, 32, 40, 48, 56, 64, 72,... 
//second is 4, 12, 20, 28, 36, 44, 52, 60, 68, 76, ... , 
//both are delta 8

const firstTerms = ((acrossArm + 1) / 2) - 1;
const secondTerms = firstTerms + 1

let firstSum = firstTerms * (16 + (8 * (firstTerms - 1))) / 2;
const secondSum = secondTerms * (8 + (8 * (secondTerms - 1))) / 2;

//the first sum need to include the initial block
firstSum++;


let insideTilesFirst = firstSum * getCountsforCell(2, 2);
let insideTilesSecond = secondSum * getCountsforCell(1, 2);

let insideTiles = insideTilesFirst + insideTilesSecond;

const slantCount = acrossArm

const NESlant = getCountsforCell(1, 1) * slantCount;
const SWSlant = getCountsforCell(1, 3) * slantCount;
const SESlant = getCountsforCell(3, 1) * slantCount;
const NWSlant = getCountsforCell(3, 3) * slantCount;

const slantSum = NESlant + SWSlant + SESlant + NWSlant;

const cornerSum = getCountsforCell(2, 0) + getCountsforCell(0, 2) + getCountsforCell(4, 2) + getCountsforCell(2, 4);

// 1 more partial edge than number of complete edges
const sECount = slantCount + 1;


const sESum = sECount * (getCountsforCell(1, 0) + getCountsforCell(0, 3) + getCountsforCell(3, 0) + getCountsforCell(3, 4));

console.log("insideTiles", insideTiles);
console.log("slantSum", slantSum);
console.log("cornerSum", cornerSum);
console.log("sESum", sESum);

const total = insideTiles + slantSum + cornerSum + sESum

console.log(total);
