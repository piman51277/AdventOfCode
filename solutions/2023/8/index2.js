const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const seq = input[0]

const reg = /(.{3}) = \((.{3}), (.{3})\)/

const triplets = {}
for (const line of input.slice(2)) {
  const [, triplet, first, second] = Array.from(line.match(reg))
  triplets[triplet] = [first, second]
}

const tripletIDs = Object.keys(triplets)

//get all the ones that end in "A"
const startingPositions = tripletIDs.filter(id => id.endsWith("A"))

//get all the ones that end in "Z"
const endingPositions = tripletIDs.filter(id => id.endsWith("Z"))


let positions = startingPositions
let firstZ = Array.from(startingPositions, pos => 0)
let cycle = Array.from(startingPositions, pos => 0)
let steps = 0
while (true) {
  let nextDir = seq[steps % seq.length]

  steps++

  if (nextDir === "R") {
    for (let i = 0; i < positions.length; i++) {
      positions[i] = triplets[positions[i]][1]

      if (positions[i].endsWith("Z")) {
        if (firstZ[i] === 0) {
          firstZ[i] = steps
        } else if (cycle[i] === 0) {
          cycle[i] = steps - firstZ[i]
        }
      }
    }
  } else {
    for (let i = 0; i < positions.length; i++) {
      positions[i] = triplets[positions[i]][0]

      if (positions[i].endsWith("Z")) {
        if (firstZ[i] === 0) {
          firstZ[i] = steps
        } else if (cycle[i] === 0) {
          cycle[i] = steps - firstZ[i]
        }
      }
    }
  }


  //is all of firstZ non-zero?
  if (cycle.every(val => val !== 0)) {
    break;
  }
}


//how much more do we have to add to make everything mod cycle[i] === 0?
//(a+k % p) + (b+k % p)...0

function gcd(a, b) {
  if (b === 0) {
    return a
  }

  return gcd(b, a % b)
}

function lcm(a, b) {
  return a * b / gcd(a, b)
}

//get lcm of all the cycles
let totalCycle = cycle.reduce(lcm)

console.log(`Plug this into wolfram:`)
console.log(`(${6 * steps} + 6k) mod ${totalCycle} = 0`)

console.log(`Add ${steps} to the value of k you get`)

