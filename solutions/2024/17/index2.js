const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const program = input[4].split(": ")[1].split(",").map(Number);
program.reverse();
function safeMod(a, b) {
  return ((a % b) + b) % b;
}
function testWorking(workingA, i) {
  let workingValues = [];
  for (let k = 0n; k <= 7n; k++) {
    let work = k ^ 1n;
    let c = (workingA + k) >> work;
    work = work ^ c;
    work = work ^ 6n;
    if (safeMod(work, 8n) == program[i]) {
      found = true;
      workingValues.push([(workingA + k) * 8n]);
    }
  }
  return workingValues;
}
let search = [];
const initials = testWorking(0n, 0n);
for (const entry of initials) {
  search.push([0n, entry[0]]);
}
let results = [];

let seen = new Set();
while (search.length > 0) {
  const entry = search.pop();
  const [lastDepth, proposedValue] = entry;
  if (seen.has(`${lastDepth},${proposedValue}`)) {
    continue;
  }
  seen.add(`${lastDepth},${proposedValue}`);
  if (lastDepth == program.length - 1) {
    console.log("FOUND", proposedValue / 8n);
    results.push(proposedValue / 8n);
  }
  const nextVals = testWorking(proposedValue, lastDepth + 1n);
  for (const entry of nextVals) {
    search.push([lastDepth + 1n, entry[0]]);
  }
}

console.log(results);

//print the lowet one
let lowest = results[0];
for (let i = 1; i < results.length; i++) {
  if (results[i] < lowest) {
    lowest = results[i];
  }
}
console.log(lowest);
