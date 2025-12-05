const fs = require("fs");
let [ranges, ids] = fs.readFileSync("input.txt", "utf8").split("\n\n");

ranges = ranges
  .trim()
  .split("\n")
  .map((line) => line.split("-").map(Number));
ids = ids.trim().split("\n").map(Number);

let mr = [];
ranges.sort((a, b) => a[0] - b[0]);

for (let [start, end] of ranges) {
  if (mr.length === 0 || mr[mr.length - 1][1] < start) {
    mr.push([start, end]);
  } else {
    mr[mr.length - 1][1] = Math.max(mr[mr.length - 1][1], end);
  }
}

let valid = 0;
for (let [start, end] of mr) {
  valid += end - start + 1;
}

console.log(valid);
