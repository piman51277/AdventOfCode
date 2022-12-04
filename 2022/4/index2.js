const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let count = 0;
for (const line of input) {
  const [r1, r2] = line.split(",");

  const [r1s, r1e] = r1.split("-").map((n) => parseInt(n));
  const [r2s, r2e] = r2.split("-").map((n) => parseInt(n));

  //check for overlap
  if (r1s <= r2s && r2s <= r1e) {
    count++;
  } else if (r2s <= r1s && r1s <= r2e) {
    count++;
  }
}

console.log(count);
