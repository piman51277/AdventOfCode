const fs = require("fs");
const input = fs
  .readFileSync("input.txt", "utf8")
  .split("\n\n")
  .map((x) => x.split("\n").map((k) => eval(k)))
  .flat();

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

//add two divider packets
input.push([[2]]);
input.push([[6]]);

//sort the packets

const sorted = input.sort((a, b) => (compare(a, b) ? -1 : 1));

//find index of both divider packets
const divider1 = sorted.findIndex((x) => x.length == 1 && x[0] == 2);
const divider2 = sorted.findIndex((x) => x.length == 1 && x[0] == 6);

console.log((divider1 + 1) * (divider2 + 1));
