const fs = require("fs");
let [ranges, ids] = fs.readFileSync("input.txt", "utf8").split("\n\n");

ranges = ranges
  .trim()
  .split("\n")
  .map((line) => line.split("-").map(Number));
ids = ids.trim().split("\n").map(Number);

let fresh = 0;
for (let id of ids) {
  let valid = false;
  for (let [min, max] of ranges) {
    if (id >= min && id <= max) {
      valid = true;
      break;
    }
  }
  if (!valid) {
    fresh++;
  }
}
console.log(ids.length - fresh);
