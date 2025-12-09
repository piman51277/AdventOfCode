const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let coordinates = [];
for (const line of input) {
  const [x, y] = line.split(",").map(Number);
  coordinates.push({ x, y });
}

let largestArea = -1;
for (let i = 0; i < coordinates.length; i++) {
  for (let j = i + 1; j < coordinates.length; j++) {
    const dx = Math.abs(coordinates[i].x - coordinates[j].x) + 1;
    const dy = Math.abs(coordinates[i].y - coordinates[j].y) + 1;
    const area = dx * dy;
    if (area > largestArea) {
      largestArea = area;
    }
  }
}

console.log(largestArea);
