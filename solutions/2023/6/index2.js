const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()


const times = parseInt(input[0].replace("Time: ", "").replace(/ /g, ""))
const buses = parseInt(input[1].replace("Distance: ", "").replace(/ /g, ""))


const time = times
const length = buses

//(t-x)x

let ways = 0;
for (let k = 0; k < time; k++) {
  let Distance = (time - k) * k;
  if (Distance > length) {
    ways += 1;
  }
}

console.log(ways)
