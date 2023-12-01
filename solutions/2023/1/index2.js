const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

//remove last empty line
input.pop()

const numberwords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

let sum = 0
for (let i of input) {

  let firstNumber = ""
  loop1:
  for (let j = 0; j < i.length; j++) {
    if (parseInt(i[j]) || parseInt(i[j]) === 0) {
      firstNumber = i[j]
      break
    }

    //does the input contain a number string at this index?
    for (let k = 0; k < numberwords.length; k++) {
      if (i.slice(j, j + numberwords[k].length).includes(numberwords[k])) {
        firstNumber = k
        break loop1
      }
    }
  }

  let lastNumber = ""
  loop2:
  for (let j = i.length - 1; j >= 0; j--) {

    if (parseInt(i[j]) || parseInt(i[j]) === 0) {
      lastNumber = i[j]
      break
    }

    //does the input contain a number string at this index?
    for (let k = 0; k < numberwords.length; k++) {
      if (i.slice(j, j + numberwords[k].length).includes(numberwords[k])) {
        lastNumber = k
        break loop2
      }
    }
  }

  console.log(firstNumber, lastNumber)
  sum += parseInt(firstNumber.toString() + lastNumber.toString())
}

console.log(sum)