const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

let sum = 0;

let sections = input.split("do()");
for (let i = 0; i < sections.length; i++) {
  const subs = sections[i].split("don't()");

  let ju = 0;
  for (const k of subs) {
    const reg = /mul\((\d+),(\d+)\)/g;
    const matchs = k.match(reg);

    if (ju == 0) {
      for (const match of matchs) {
        const [a, b] = match.match(/\d+/g);
        sum += a * b;
      }
    }
    ju++;
  }
}

console.log(sum);
