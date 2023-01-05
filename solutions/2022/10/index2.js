const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let registerValues = [];
let register = 1;

for (const line of input) {
  const [instruction, value] = line.split(" ");
  if (instruction == "noop") {
    registerValues.push(register);
  } else {
    registerValues.push(register);
    registerValues.push(register);
    register += parseInt(value);
  }
}

let sum = 0;
for (let i = 19; i < registerValues.length; i += 40) {
  sum += registerValues[i] * (i + 1);
}

let spritePosition = 0;
for (let x = 0; x < 6; x++) {
  let str = "";
  for (let pos = 0; pos < 40; pos++) {
    const index = x * 40 + pos;
    spritePosition = registerValues[index] - 1;

    //if pos is in range [spritePosition, spritePosition + 2]
    if (pos >= spritePosition && pos <= spritePosition + 2) {
      str += "#";
    } else {
      str += ".";
    }
  }
  console.log(str);
}
