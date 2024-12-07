const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

function evaluateString(nums, ops) {
  let result = nums[0];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "+") {
      result += nums[i + 1];
    } else if (ops[i] === "*") {
      result *= nums[i + 1];
    } else {
      result = parseInt(result.toString() + nums[i + 1].toString());
    }
  }
  return result;
}

let ok = 0;

for (const line of input) {
  const [test, rest] = line.split(": ");
  const nums = rest.trim().split(" ").map(Number);

  const possibleOps = ["+", "*", "||"];
  for (let i = 0; i < Math.pow(3, nums.length - 1); i++) {
    const binary = i.toString(3).padStart(nums.length - 1, "0");
    const ops = binary.split("").map((x) => possibleOps[x]);
    //console.log(test, nums, ops, evaluateString(nums, ops));
    if (evaluateString(nums, ops) === parseInt(test)) {
      ok += parseInt(test);
      break;
    }
  }
}

console.log(ok);
