const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()



const cardCounts = Array(input.length).fill(1)
let total = 0
for (let k = 0; k < input.length; k++) {
  const line = input[k]
  let numbers = line.split(": ")[1]
  const count = cardCounts[k]
  total += count

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
    for (let i = k + 1; i < k + 1 + won; i++) {
      cardCounts[i] += count;
    }
  }
}

console.log(total)