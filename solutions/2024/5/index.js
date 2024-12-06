const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

const cutoff = 1176;

const pairs = input.slice(0, cutoff).map((k) => k.split("|").map(Number));
const runs = input.slice(cutoff + 1).map((k) => k.split(",").map(Number));

let ok = 0;
for (const run of runs) {
  let rules = [];

  for (let i = 0; i < run.length; i++) {
    //get all rules that include the current number
    rules = rules.concat(pairs.filter((k) => k.includes(run[i])));
  }

  //filter all rules where both numbers don't exist in the run
  rules = rules.filter((k) => {
    return k.every((n) => run.includes(n));
  });

  //check if the rules are good
  let good = true;
  for (let i = 0; i < rules.length; i++) {
    const [first, second] = rules[i];
    //get the index of the first and
    const fIndex = run.indexOf(first);
    const sIndex = run.indexOf(second);

    if (fIndex > sIndex) {
      good = false;
      break;
    }
  }

  if (good) {
    //get the middle number
    const middle = run[Math.floor(run.length / 2)];
    ok += middle;
  }
}

console.log(ok);
