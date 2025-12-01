const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

let current = 50;
let count = 0;
for (const line of input) {
  const rotateLeft = line[0] === "L";
  const number = parseInt(line.slice(1), 10);

  if (rotateLeft) {
    current = (current - number + 100) % 100;
  } else {
    current = (current + number) % 100;
  }

  if (current === 0) {
    count++;
  }
}

console.log(count);
