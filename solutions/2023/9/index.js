const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

function getSpaceSeparatedNumbers(string) {
  return string.split(" ").map(Number);
}

function processSet(s) {
  const diffSets = [s]

  while (true) {
    let tempset = []
    let lastSet = diffSets[diffSets.length - 1]

    //get the difference between the current element and the next element
    for (let j = 1, i = 0; j < lastSet.length; i = j++) {
      tempset.push(lastSet[j] - lastSet[i])
    }

    diffSets.push(tempset)

    //if this is all 0s, end
    if (tempset.every(x => x === 0)) {
      break
    }
  }

  return diffSets
}

function getNextValue(diffSets) {
  //add a 0 to the end of he last diff
  diffSets[diffSets.length - 1].push(0)

  for (let i = diffSets.length - 2; i >= 0; i--) {
    //get the last element of the last set
    let lastElement = diffSets[i + 1][diffSets[i + 1].length - 1]

    //get the laast element of this set
    let lastSet = diffSets[i]

    diffSets[i].push(lastSet[lastSet.length - 1] + lastElement)
  }

  return diffSets[0][diffSets[0].length - 1]
}


let sum = 0;
for (let line of input) {
  let set = getSpaceSeparatedNumbers(line)
  let diffSets = processSet(set)
  let nextValue = getNextValue(diffSets)
  sum += nextValue
}

console.log(sum)