const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split(",");
input.pop();

function isRepeating(str) {
  if (str.length % 2 !== 0) return false;
  const half = str.length / 2;
  return str.slice(0, half) === str.slice(half);
}

let sum = 0;

for (const line of input) {
  const [n0, n1] = line.trim().split("-").map(Number);

  for (let i = n0; i <= n1; i++) {
    let tostr = i.toString();
    if (isRepeating(tostr)) {
      sum += i;
    }
  }
}

console.log(sum);
