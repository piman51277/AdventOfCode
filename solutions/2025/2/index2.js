const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split(",");
input.pop();

function isRepeatingN(str, n) {
  //does it have any string repeating more than twice consecutively
  if (str.length % n !== 0) return false;
  const segmentLength = str.length / n;
  const segment = str.slice(0, segmentLength);
  for (let i = 1; i < n; i++) {
    if (str.slice(i * segmentLength, (i + 1) * segmentLength) !== segment) {
      return false;
    }
  }
  return true;
}

function isRepeating(str) {
  let anyOk = false;
  for (let n = 2; n <= str.length; n++) {
    if (isRepeatingN(str, n)) {
      anyOk = true;
      break;
    }
  }
  return anyOk;
}

let sum = 0;

for (const line of input) {
  const [n0, n1] = line.trim().split("-").map(Number);

  for (let i = n0; i <= n1; i++) {
    let tostr = i.toString();
    if (isRepeating(tostr)) {
      console.log(tostr);
      sum += i;
    }
  }
}

console.log(sum);
