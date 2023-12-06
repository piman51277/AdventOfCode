const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const times = Array.from(input[0].replace("Time: ", "").matchAll(/\d+/g), m => parseInt(m[0]));
const buses = Array.from(input[1].replace("Distance: ", "").matchAll(/\d+/g), m => parseInt(m[0]));


let prods = 1;
for (let i = 0; i < times.length; i++) {
  const time = times[i];
  const length = buses[i];

  //(t-x)x

  let ways = 0;
  for (let k = 0; k < time; k++) {
    let Distance = (time - k) * k;
    if (Distance > length) {
      ways += 1;
    }
  }

  prods *= ways;
}

console.log(prods)