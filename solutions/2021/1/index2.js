const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n").map(Number);

const values = [];

for (let i = 0; i < input.length - 2; i++) {
  const p1 = input[i];
  const p2 = input[i + 1];
  const p3 = input[i + 2];

  values.push(p1 + p2 + p3);
}

let count = 0;
for (let i = 0; i < values.length - 1; i++) {
  const p1 = values[i];
  const p2 = values[i + 1];

  if (p1 < p2) count++;
}
console.log(count);
