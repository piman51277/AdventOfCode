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

//sort both smallest to largest
list1.sort((a, b) => a - b);
list2.sort((a, b) => a - b);

let dist = 0;
for (let i = 0; i < list1.length; i++) {
  dist += Math.abs(list1[i] - list2[i]);
}

console.log(dist);
