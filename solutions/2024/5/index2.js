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

  if (!good) {
    //remake but follow the rules
    let newRun = [run[0]];

    //for each number try inserting in every position and check if it's good
    for (let i = 1; i < run.length; i++) {
      const toInsert = run[i];
      for (let l = 0; l <= newRun.length; l++) {
        const temp = [...newRun];
        temp.splice(l, 0, toInsert);

        let good = true;
        for (let j = 0; j < rules.length; j++) {
          const [first, second] = rules[j];
          //get the index of the first and
          const fIndex = temp.indexOf(first);
          const sIndex = temp.indexOf(second);

          if (fIndex > sIndex && fIndex !== -1 && sIndex !== -1) {
            good = false;
            break;
          }
        }

        if (good) {
          newRun = temp;
          break;
        }
      }
    }

    //get teh middle
    const middle = newRun[Math.floor(newRun.length / 2)];
    ok += middle;
  }
}

console.log(ok);
