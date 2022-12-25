const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let totalSum = 0;
let maxPower = 0;
for (const line of input) {
  let power = 0;
  const chars = line.split("").reverse();
  let sum = 0;
  for (const char of chars) {
    switch (char) {
      case "2":
        sum += 2 * 5 ** power;
        break;
      case "1":
        sum += 1 * 5 ** power;
        break;
      case "0":
        sum += 0 * 5 ** power;
        break;
      case "-":
        sum += -1 * 5 ** power;
        break;
      case "=":
        sum += -2 * 5 ** power;
        break;
    }
    power++;
  }
  if (power > maxPower) {
    maxPower = power;
  }

  totalSum += sum;
}

/**
 * SNAFU is a new number system that uses the following characters:
 * 0, 1, 2, -, =
 * each place has 5 times the value of the previous place
 *
 */

function convertToSNAFU(n) {
  let result = "";
  let power = Math.ceil(Math.log(n) / Math.log(5));
  while (n != 0) {
    //pick the value that gets us closest to 0
    let closest = 0;
    let closestValue = 0;
    for (let i = -2; i <= 2; i++) {
      const value = i * 5 ** power;
      if (Math.abs(value - n) < Math.abs(closestValue - n)) {
        closest = i;
        closestValue = value;
      }
    }

    switch (closest) {
      case 2:
        result += "2";
        break;
      case 1:
        result += "1";
        break;
      case 0:
        result += "0";
        break;
      case -1:
        result += "-";
        break;
      case -2:
        result += "=";
        break;
    }
    n -= closestValue;
    power--;
  }
  //add the 0 for the last place
  result += "0";

  //take off leading 0s
  while (result[0] === "0") {
    result = result.slice(1);
  }

  return result;
}

console.log(convertToSNAFU(totalSum));
