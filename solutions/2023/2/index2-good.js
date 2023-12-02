//my solution, except I use proper regex groups this time
const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

let redPattern = /(\d+) red/g
let greenPattern = /(\d+) green/g
let bluePattern = /(\d+) blue/g


let count = 0
for (let line of input) {
  const maxRed = Math.max(...Array.from(line.matchAll(redPattern), m => parseInt(m[1])))
  const maxGreen = Math.max(...Array.from(line.matchAll(greenPattern), m => parseInt(m[1])))
  const maxBlue = Math.max(...Array.from(line.matchAll(bluePattern), m => parseInt(m[1])))
  count += maxRed * maxGreen * maxBlue
}

console.log(count)