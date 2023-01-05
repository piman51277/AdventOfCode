const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let aim = 0;
let hor = 0;
let dep = 0;

for (const line in input) {
  const [command, rvalue] = input[line].split(" ");
  const value = parseInt(rvalue);

  if (command === "forward") {
    hor += value;
    dep += aim * value;
  } else if (command === "down") {
    aim += value;
  } else if (command === "up") {
    aim -= value;
  }
}

console.log(hor * dep);
