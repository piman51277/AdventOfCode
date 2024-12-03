const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

//regect for mul(...,...)
const reg = /mul\((\d+),(\d+)\)/g;
const matchs = input.match(reg);

let sum = 0;
for (const match of matchs) {
  const [a, b] = match.match(/\d+/g);
  sum += a * b;
}

console.log(sum);
