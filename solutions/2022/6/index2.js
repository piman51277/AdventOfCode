const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let count = 0;
for (const line of input) {
  let length = line.length;
  for (let i = 0; i < length; i++) {
    const substr = line.substring(i, i + 14);

    //if all characters are different
    let arr = [];
    let ok = true;
    for (let j = 0; j < substr.length; j++) {
      if (!arr.includes(substr[j])) {
        arr.push(substr[j]);
      } else {
        ok = false;
        break;
      }
    }

    if (ok) {
      console.log(i + 14, substr);
      break;
    }
  }
}

console.log(count);
