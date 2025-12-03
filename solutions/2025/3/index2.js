const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

let sum = 0;
for (const line of input) {
  const numbers = line.split("");
  let buf = numbers.slice(0, 12);
  for (let i = 12; i < numbers.length; i++) {
    let maxVal = parseInt(buf.join(""));
    let maxPos = -1;
    for (let j = 0; j < buf.length; j++) {
      let newBuf = [...buf].slice(0, j).concat(buf.slice(j + 1));
      newBuf.push(numbers[i]);
      let newVal = parseInt(newBuf.join(""));
      if (newVal >= maxVal) {
        maxVal = newVal;
        maxPos = j;
      }
    }
    if (maxPos == -1) continue;
    buf = buf.slice(0, maxPos).concat(buf.slice(maxPos + 1));
    buf.push(numbers[i]);
  }
  sum += parseInt(buf.join(""));
}
console.log(sum);
