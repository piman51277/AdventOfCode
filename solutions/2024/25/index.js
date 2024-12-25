const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split("\n\n");
const locks = [];
for (const p of input) {
  const lines = p.split("\n");
  //check if the top line is #####
  const top = lines[0];

  const type = top == "#####" ? true : false;

  //there are 5 close, count number in each cl
  const colValues = [-1, -1, -1, -1, -1];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (lines[j][i] == "#") {
        colValues[i]++;
      }
    }
  }

  locks.push({ type, colValues });
}

console.log(locks.length);

const actualLocks = locks.filter((lock) => lock.type == false);
const virtualLocks = locks.filter((lock) => lock.type == true);

let matches = 0;

for (const a of actualLocks) {
  for (const v of virtualLocks) {
    //if each col add up to 5
    let valid = true;
    for (let i = 0; i < 5; i++) {
      if (a.colValues[i] + v.colValues[i] >= 6) {
        valid = false;
        break;
      }
    }
    if (valid) {
      matches++;
    }
  }
}
console.log(matches);
