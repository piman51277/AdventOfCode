const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let hor = 0;
let dep = 0;

for (const line in input) {
  const [command, rvalue] = input[line].split(" ");
  const value = parseInt(rvalue);

  if (command === "forward") {
    hor += value;
  } else if (command === "down") {
    dep += value;
  } else if (command === "up") {
    dep -= value;
  }
}

console.log(hor * dep);
