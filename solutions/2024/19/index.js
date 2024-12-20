const fs = require("fs");
const [fInput, sInput] = fs
  .readFileSync("input.txt", "utf8")
  .trim()
  .split("\n\n");

const patterns = fInput.split(", ");
const designs = sInput.split("\n");

function isPossible(design) {
  function recurse(startIndex) {
    if (startIndex === design.length) {
      return true;
    }
    for (const pattern of patterns) {
      //check if the design would fit
      if (
        design.slice(startIndex).startsWith(pattern) &&
        design.length >= startIndex + pattern.length
      ) {
        //recurse
        if (recurse(startIndex + pattern.length)) {
          return true;
        }
      }
    }
    return false;
  }

  return recurse(0);
}

let possible = 0;
for (const design of designs) {
  if (isPossible(design)) {
    possible++;
  }
}

console.log(possible);
