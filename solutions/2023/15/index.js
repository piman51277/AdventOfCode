const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");



function getHash(str) {
  let val = 0;
  for (let i = 0; i < str.length; i++) {
    let cod = str.charCodeAt(i);
    val += cod;
    val *= 17;
    val = val % 256;
  }
  return val;
}

const instuctions = input[0].split(",")
let sum = 0;
for (let i = 0; i < instuctions.length; i++) {
  sum += getHash(instuctions[i])
}

console.log(sum)