const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const cases = input.split("\n");

function rps(a, b) {
  if (a === b) {
    return 3;
  }
  if (a === "R" && b === "S") {
    return 0;
  }
  if (a === "S" && b === "P") {
    return 0;
  }
  if (a === "P" && b === "R") {
    return 0;
  }
  return 6;
}


let totalScore = 0;
for (let i = 0; i < cases.length; i++) {
  const [them, us] = cases[i].split(" ");

  //convert ABC -> RPS
  const themRPS = them.replace(/A/g, "R").replace(/B/g, "S").replace(/C/g, "P");

  //convert XYZ -> RPS
  const usRPS = us.replace(/X/g, "R").replace(/Y/g, "S").replace(/Z/g, "P");

  let score = rps(usRPS, themRPS);

  if (us == "X") score += 1;
  if (us == "Y") score += 2;
  if (us == "Z") score += 3;
  totalScore += score;
};

console.log(totalScore);