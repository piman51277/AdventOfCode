const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()



const cards = []
let total = 0
for (const line of input) {
  let numbers = line.split(": ")[1]

  let [winning, other] = numbers.split(" | ")
  winning = winning.split(" ").filter(x => x != "").map(x => parseInt(x.match(/\d+/)[0]))
  other = other.split(" ").filter(x => x != "").map(x => parseInt(x.match(/\d+/)[0]))

  let won = 0
  for (const entry of other) {
    if (winning.includes(entry)) {
      won += 1
    }
  }

  if (won != 0) {
    const score = 2 ** Math.max(won - 1, 0)
    total += score
  }
}

console.log(total)