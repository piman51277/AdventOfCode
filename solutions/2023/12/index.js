const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const pairs = input.map((line) => line.split(" "));


let ways = 0;
for (let pair of pairs) {
  const [springstr, lengs] = pair;

  const ls = lengs.split(",").map(Number);

  //get number of ?
  const numQ = springstr.split("?").length - 1;
  const numUn = springstr.split("").filter((x) => x === "?").length

  let limit = 2 ** (numQ);

  let p = 0;

  //loop through all possible states
  for (let i = 0; i < limit; i++) {
    let state = springstr;
    const b = i.toString(2).padStart(numUn, "0");
    //replace ? with . or #
    for (let i = 0; i < b.length; i++) {
      state = state.replace("?", b[i] === "0" ? "." : "#")
    }
    k = state.split(".")
    //remove empty strings
    k = k.filter((x) => x !== "")
    let groups = k.map((x) => x.length)
    //check if groups match
    if (groups.length === ls.length && groups.every((x, i) => x === ls[i])) {
      p++;
    }
  }
  ways += p;
}

console.log(ways);