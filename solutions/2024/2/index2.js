const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

function isOK(entries) {
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
    if (safe) return true;
  }

  return false;
}

let ok = 0;

for (const line of input) {
  const entries = line.split(" ").map((k) => parseInt(k));

  if (isOK(entries)) {
    ok++;
    continue;
  }

  for (let i = 0; i < entries.length; i++) {
    //create an array with just index i removed
    let newEntries = entries.slice();
    newEntries.splice(i, 1);

    console.log(newEntries);

    if (isOK(newEntries)) {
      ok++;
      break;
    }
  }
}

console.log(ok);
