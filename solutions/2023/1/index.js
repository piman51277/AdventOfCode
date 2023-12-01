const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

//remove last empty line
input.pop()

let sum = 0
for (let i in input) {
  let firstNumber = ""
  for (let j = 0; j < input[i].length; j++) {
    if (parseInt(input[i][j]) || parseInt(input[i][j]) === 0) {
      firstNumber = input[i][j]
    }
  }
  let lastNumber = ""
  for (let j = input[i].length - 1; j >= 0; j--) {
    if (parseInt(input[i][j]) || parseInt(input[i][j]) === 0) {
      lastNumber = input[i][j]
    }
  }

  console.log(firstNumber + lastNumber)
  sum += parseInt(lastNumber + firstNumber)
}

console.log(sum)