const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const seeds = input[0].replace("seeds: ", "").split(" ").map(Number);

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

console.log(maps)

//for each seed
let locations = []
for (const seed of seeds) {

  let loc = seed
  console.log(loc)
  for (let i = 0; i < maps.length; i++) {
    for (let assignment of maps[i]) {
      const [to, from, range] = assignment

      if (loc >= from && loc <= from + range - 1) {
        loc = to + (loc - from)
        break;
      }
    }
  }

  console.log("...");

  locations.push(loc)
}

console.log(locations.join(" "))
console.log(Math.min(...locations));