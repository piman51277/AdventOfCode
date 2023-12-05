const fs = require("fs");
const { get } = require("http");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const seedRangePairs = input[0].replace("seeds: ", "").split(" ").map(Number);


const pairs = []
for (let i = 0; i < seedRangePairs.length; i += 2) {
  const seed = seedRangePairs[i];
  const range = seedRangePairs[i + 1];

  pairs.push([seed, seed + range - 1])
}

//find the index of these keywords
const splits = [
  input.indexOf("seed-to-soil map:"),
  input.indexOf("soil-to-fertilizer map:"),
  input.indexOf("fertilizer-to-water map:"),
  input.indexOf("water-to-light map:"),
  input.indexOf("light-to-temperature map:"),
  input.indexOf("temperature-to-humidity map:"),
  input.indexOf("humidity-to-location map:"),
  input.length + 1
]

//split the input into the different maps
const maps = []

for (let i = 0; i < splits.length - 1; i++) {
  const firstIndex = splits[i];
  const secondIndex = splits[i + 1] - 1;

  const lines = input.slice(firstIndex + 1, secondIndex);
  const split = [];

  for (const line of lines) {
    split.push(line.split(" ").map(Number));
  }
  maps.push(split);
}


function getLocationofSeed(seed) {
  let loc = seed
  for (let i = 0; i < maps.length; i++) {
    for (let assignment of maps[i]) {
      const [to, from, range] = assignment

      if (loc >= from && loc <= from + range - 1) {
        loc = to + (loc - from)
        break;
      }
    }
  }
  return loc
}

//for each seed
let minLocInPair = []
for (const pair of pairs) {
  const [seed1, seed2] = pair

  let minLoc = Infinity
  let minLocSeed = seed1
  for (let i = seed1; i <= seed2; i += 1000) {
    const loc = getLocationofSeed(i)
    if (loc < minLoc) {
      minLoc = loc
      minLocSeed = i
    }
  }

  minLocInPair.push([minLoc, minLocSeed, seed1, seed2])
  console.log("FINSIHED A PAIR")
}

//get the min seed
let minLoc = Infinity
let range = [0, 0, 0]
//foor
for (const [loc, seed, seed1, seed2] of minLocInPair) {
  if (loc < minLoc) {
    minLoc = loc
    range = [seed, seed1, seed2]
  }
}

//look +- 10000 from the min seed
let delta = 100000
let minSearch = Math.max(range[0] - delta, range[1])
let maxSearch = Math.min(range[0] + delta, range[2])

let minLocSeed = minSearch
let minLocSeedLoc = Infinity
for (let i = minSearch; i <= maxSearch; i++) {
  const loc = getLocationofSeed(i)
  if (loc < minLocSeedLoc) {
    minLocSeedLoc = loc
    minLocSeed = i
  }
}

console.log(getLocationofSeed(minLocSeed))