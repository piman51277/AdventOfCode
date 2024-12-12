const fs = require("fs");
const inputRaw = fs.readFileSync("input.txt", "utf8").split("\n");
const input = inputRaw[0].split(" ").map(Number);

function getNum(n_input) {
  let working = [...n_input];

  for (let i = 0; i < 5; i++) {
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

  //get the frequencies
  let frequencies = {};
  for (const element of working) {
    if (frequencies[element] == undefined) {
      frequencies[element] = BigInt(1);
    } else {
      frequencies[element] += BigInt(1);
    }
  }
  return frequencies;
}

let cache = {};

let currentItr = 0;
let currentFrequencies = {};

//populate the initial frequencies
for (const element of input) {
  if (currentFrequencies[element] == undefined) {
    currentFrequencies[element] = BigInt(1);
  } else {
    currentFrequencies[element] += BigInt(1);
  }
}

let nextFrequencies = {};

while (currentItr < 75) {
  for (const [key, value] of Object.entries(currentFrequencies)) {
    //check if the children are in the cache
    if (cache[key] == undefined) {
      cache[key] = getNum([key]);
    }

    //add the children to the next frequencies
    for (const [childKey, childValue] of Object.entries(cache[key])) {
      if (nextFrequencies[childKey] == undefined) {
        nextFrequencies[childKey] = value * childValue;
      } else {
        nextFrequencies[childKey] += value * childValue;
      }
    }
  }

  currentFrequencies = {};
  for (const [key, value] of Object.entries(nextFrequencies)) {
    currentFrequencies[key] = value;
  }
  nextFrequencies = {};
  currentItr += 5;
}

//get the total
let total = 0n;
for (const [key, value] of Object.entries(currentFrequencies)) {
  total += value;
}
console.log(total);
