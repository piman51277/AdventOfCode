const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n").map(Number);

let count = 0;
for (let i = 0; i < input.length - 1; i++) {
  const p1 = input[i];
  const p2 = input[i + 1];

  if (p1 < p2) count++;
}
console.log(count);
