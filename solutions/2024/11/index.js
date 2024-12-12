const fs = require("fs");
const inputRaw = fs.readFileSync("input.txt", "utf8").split("\n");
const input = inputRaw[0].split(" ").map(Number);

let working = [...input];

for (let i = 0; i < 25; i++) {
  console.log(working);
  let newWorking = [];
  for (const element of working) {
    if (element == 0) {
      newWorking.push(1);
      continue;
    }

    if (element.toString().length % 2 == 0) {
      newWorking.push(
        parseInt(element.toString().slice(0, element.toString().length / 2))
      );
      newWorking.push(
        parseInt(element.toString().slice(element.toString().length / 2))
      );
      continue;
    }

    newWorking.push(element * 2024);
  }

  working = newWorking;
}

console.log(working.length);
