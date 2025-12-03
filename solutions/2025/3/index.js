const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

let sum = 0;
for (const line of input) {
  const numbers = line.split("").map(Number);
  console.log(line);

  // look for pairs
  let largest = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const product = numbers[i] * 10 + numbers[j];
      if (product > largest) {
        largest = product;
      }
    }
  }
  sum += largest;
}

console.log(sum);
