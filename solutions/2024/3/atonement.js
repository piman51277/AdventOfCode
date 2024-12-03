//part 2 with no regex

const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

let sum = 0;

const isDigit = (c) => c >= "0" && c <= "9";
let enabled = true;
for (let i = 0; i < input.length; i++) {
  //check for prefixes
  if (input.slice(i, i + 4) === "mul(") {
    let charbuf = "";
    let ptr = i + 4;
    while (isDigit(input[ptr])) {
      charbuf += input[ptr];
      ptr++;
    }
    if (input[ptr] === ",") {
      ptr++;
      let charbuf2 = "";
      while (isDigit(input[ptr])) {
        charbuf2 += input[ptr];
        ptr++;
      }
      if (input[ptr] === ")") {
        if (enabled) {
          sum += parseInt(charbuf) * parseInt(charbuf2);
        }
      }
    }
  } else if (input.slice(i, i + 4) === "do()") {
    enabled = true;
  } else if (input.slice(i, i + 7) === "don't()") {
    enabled = false;
  }
}

console.log(sum);
