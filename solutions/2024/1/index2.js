const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

const list1 = [];
const list2 = [];

for (const line of input) {
  const [first, second] = line.split("   ");
  list1.push(parseInt(first));
  list2.push(parseInt(second));
}

let simScore = 0;

for (const i of list1) {
  let count = 0;
  for (const j in list2) {
    if (i === list2[j]) {
      count++;
    }
  }
  simScore += count * i;
}

console.log(simScore);
