const fs = require("fs");
const input = fs
  .readFileSync("input.txt", "utf8")
  .split("\n\n")
  .map((x) => x.split("\n").map((k) => eval(k)));

function compare(left, right, hasRecursed = false) {
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const elementLeft = left[i];
    const elementRight = right[i];

    if (elementLeft == undefined) {
      return true;
    }
    if (elementRight == undefined) {
      return false;
    }

    //if both are integers
    if (Number.isInteger(elementLeft) && Number.isInteger(elementRight)) {
      if (elementLeft > elementRight) {
        return false;
      } else if (elementLeft < elementRight) {
        return true;
      }
    }

    //if both are lists
    if (Array.isArray(elementLeft) && Array.isArray(elementRight)) {
      const val = compare(elementLeft, elementRight, true);
      if (val != undefined) {
        return val;
      }
    }

    //if one is a list and the other is an integer
    if (Array.isArray(elementLeft) && Number.isInteger(elementRight)) {
      const val = compare(elementLeft, [elementRight], true);
      if (val != undefined) {
        return val;
      }
    }

    if (Array.isArray(elementRight) && Number.isInteger(elementLeft)) {
      const val = compare([elementLeft], elementRight, true);
      if (val != undefined) {
        return val;
      }
    }
  }

  if (hasRecursed) return undefined;

  return true;
}

let sum = 0;
for (let k = 0; k < input.length; k++) {
  const pair = input[k];
  const left = pair[0];
  const right = pair[1];

  if (compare(left, right)) {
    console.log(k + 1);
    sum += k + 1;
  }
}

console.log(sum);
