const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

let count = 0;

for (const line of input) {
  const entries = line.split(" ").map((k) => parseInt(k));

  let isIncreasing = false;
  let isDecreasing = false;
  let safe = true;

  for (let i = 0; i < entries.length; i++) {
    if (entries[i] < entries[i + 1]) {
      isIncreasing = true;
    } else if (entries[i] > entries[i + 1]) {
      isDecreasing = true;
    }

    let delta = Math.abs(entries[i] - entries[i + 1]);
    if (delta == 0 || delta > 3) {
      safe = false;
    }
  }

  if ((isIncreasing || isDecreasing) && !(isIncreasing && isDecreasing)) {
    if (safe) count++;
  }
}

console.log(count);
