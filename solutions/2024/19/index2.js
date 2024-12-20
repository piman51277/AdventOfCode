const fs = require("fs");
const [fInput, sInput] = fs
  .readFileSync("input.txt", "utf8")
  .trim()
  .split("\n\n");

const patterns = fInput.split(", ");
const designs = sInput.split("\n");

function isPossible(design) {
  let cache = {};

  function recurse(startIndex) {
    if (cache[startIndex] !== undefined) {
      console.log("cache hit", startIndex, cache[startIndex]);
      return cache[startIndex];
    }

    if (startIndex === design.length) {
      return true;
    }
    let oks = 0;
    for (const pattern of patterns) {
      if (
        design.slice(startIndex).startsWith(pattern) &&
        design.length >= startIndex + pattern.length
      ) {
        const val = recurse(startIndex + pattern.length);
        oks += val;
      }
    }
    cache[startIndex] = oks;
    console.log("cache set", startIndex, oks);
    return oks;
  }

  return recurse(0);
}

let possible = 0;
for (const design of designs) {
  const k = isPossible(design);
  possible += k;
  console.log(design, k);
}

console.log(possible);
