const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const seq = input[0]

const reg = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/

const triplets = {}
for (const line of input.slice(2)) {
  const [, triplet, first, second] = Array.from(line.match(reg))
  triplets[triplet] = [first, second]
}

let pos = "AAA"
let steps = 0
while (pos !== "ZZZ") {
  const [first, second] = triplets[pos]
  let nextDir = seq[steps % seq.length]

  if (nextDir === "R") {
    pos = second
  } else {
    pos = first
  }
  steps++
}

console.log(steps)

