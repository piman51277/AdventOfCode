const fs = require("fs");
let [n0, n1, n2, n3, ops] = fs.readFileSync("input.txt", "utf8").split("\n");

n0 = n0
  .split(" ")
  .filter((x) => x.length > 0)
  .map((x) => parseInt(x));
n1 = n1
  .split(" ")
  .filter((x) => x.length > 0)
  .map((x) => parseInt(x));
n2 = n2
  .split(" ")
  .filter((x) => x.length > 0)
  .map((x) => parseInt(x));
n3 = n3
  .split(" ")
  .filter((x) => x.length > 0)
  .map((x) => parseInt(x));
ops = ops.split(" ").filter((x) => x.length > 0);

let sum = BigInt(0);
for (let i = 0; i < ops.length; i++) {
  let op = ops[i];

  let val = 0;

  if (op == "+") {
    val = n0[i] + n1[i] + n2[i] + n3[i];
  } else {
    val = n0[i] * n1[i] * n2[i] * n3[i];
  }

  console.log(val);
  sum += BigInt(val);
}

console.log(sum.toString());
