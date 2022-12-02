const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const cases = input.split("\n");

//result is 0 to lose, 1 to tie, 2 to win
function rpsRigger(thierRPS, result) {
  if (result === 2) {
    if(thierRPS == "R") {
      return "P"
    }
    else if(thierRPS == "S") {
      return "R"
    }
    else if(thierRPS == "P") {
      return "S"
    }
  }
  else if (result === 0) {
    if (thierRPS == "R") {
      return "S";
    } else if (thierRPS == "S") {
      return "P";
    } else if (thierRPS == "P") {
      return "R";
    }
  }
  else if(result === 1) {
    return thierRPS;
  }
}
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
  const themRPS = them.replace(/A/g, "R").replace(/B/g, "P").replace(/C/g, "S");

  //convert XYZ -> 0,1,2
  const usState = parseInt(us.replace(/X/g, "0").replace(/Y/g, "1").replace(/Z/g, "2"));

  const usRPS = rpsRigger(themRPS, usState);

  let score = rps(themRPS, usRPS);

  if (usRPS == "R") score += 1;
  if (usRPS == "P") score += 2;
  if (usRPS == "S") score += 3;
  totalScore += score;

}

console.log(totalScore);
