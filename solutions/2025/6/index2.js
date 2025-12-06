const fs = require("fs");
let lines = fs.readFileSync("input.txt", "utf8").split("\n");
let ops = lines.pop();

let sum = 0;
let cache = [];
let op = "";
for (let i = 0; i < ops.length; i++) {
  if (ops[i] !== " ") {
    op = ops[i];
  }
  const entries = [];
  for (let j = 0; j < lines.length; j++) {
    if (lines[j].length > 0) {
      entries.push(lines[j][i]);
    }
  }
  if (entries.every((e) => e === " ")) {
    cache = cache.map(Number);
    sum += eval(cache.join(` ${op} `));
    cache = [];
  } else {
    cache.push(entries.join("").trim());
  }
}
cache = cache.map(Number);
sum += eval(cache.join(` ${op} `));
cache = [];
console.log(sum);
