const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const seedRangePairs = input[0].replace("seeds: ", "").split(" ").map(Number);


const pairs = []
let searchspace = 0
for (let i = 0; i < seedRangePairs.length; i += 2) {
  const seed = seedRangePairs[i];
  const range = seedRangePairs[i + 1];

  pairs.push([seed, seed + range - 1])
  searchspace += range
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

let outfile = ""

//pairs
outfile += pairs.length + "\n"
for (const pair of pairs) {
  outfile += pair.join(" ") + "\n"
}

//maps
outfile += maps.length + "\n"

for (const map of maps) {
  outfile += map.length + "\n"
  for (const assignment of map) {
    outfile += assignment.join(" ") + "\n"
  }
}

fs.writeFileSync("inputeasy.txt", outfile)