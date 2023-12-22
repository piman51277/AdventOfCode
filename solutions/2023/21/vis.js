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

console.log("writing png");

const PNG = require("pngjs").PNG;


//create a PNG of size (131 * 5) * (131 * 5)
const png = new PNG({
  width: 131 * 5,
  height: 131 * 5,
  colorType: 2,
  filterType: 4,
});

//set each pixel
for (let i = 0; i < png.width; i++) {
  console.log(`writing line ${i}/${png.width}`);

  for (let j = 0; j < png.height; j++) {
    const idx = (png.width * j + i) << 2;
    png.data[idx + 3] = 255;

    if (pointsCopy.includes(`${i},${j}`)) {
      png.data[idx + 2] = 255;
    }

    else if (grid[i][j] === "#") {

      png.data[idx] = 255;
      png.data[idx + 1] = 255;
      png.data[idx + 2] = 255;
    }
  }
}

console.log("saving png");

//write the png
png.pack().pipe(fs.createWriteStream("out.png"));