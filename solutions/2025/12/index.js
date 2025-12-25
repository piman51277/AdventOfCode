const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n\n");
let regions = input.pop();
let shapes = [...input];

for (let i = 0; i < shapes.length; i++) {
  let lines = shapes[i].split("\n");
  let shape = [];
  for (let j = 1; j < lines.length; j++) {
    shape.push(lines[j].split("").map((n) => n == "#"));
  }
  shapes[i] = shape;
}

let parsedRegions = [];
for (let line of regions.split("\n")) {
  let [dims, entries] = line.split(": ");
  let [x, y] = dims.split("x").map(Number);
  let indicies = entries.split(" ").map(Number);
  parsedRegions.push({ x, y, indicies });
}
regions = parsedRegions;

let shapeAreas = [];
for (let shape of shapes) {
  let area = 0;
  for (let row of shape) {
    for (let cell of row) {
      if (cell) area++;
    }
  }
  shapeAreas.push(area);
}

let ok = 0;
for (let { x, y, indicies } of regions) {
  //sanity check, we must have enough cells to fit the shapes
  let totalArea = x * y;

  let shapesArea = 0;
  for (let i = 0; i < indicies.length; i++) {
    shapesArea += shapeAreas[i] * indicies[i];
  }
  if (shapesArea > totalArea) {
    continue;
  }

  //would these fit naively?
  let naiveCountX = Math.floor(x / 3);
  let naiveCountY = Math.floor(y / 3);
  let naiveCapacity = naiveCountX * naiveCountY;
  let totalShapes = indicies.reduce((a, b) => a + b, 0);
  if (totalShapes <= naiveCapacity) {
    ok++;
    continue;
  }

  //give up
}

console.log(ok);
