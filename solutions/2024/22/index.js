const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();
const cl = console.log;

let sum = 0n;
for (const line of input) {
  let secret = BigInt(parseInt(line));

  for (let i = 0; i < 2000; i++) {
    const i64 = secret * 64n;
    secret = i64 ^ secret;
    secret = secret % 16777216n;

    const s2 = secret / 32n;
    secret = secret ^ s2;
    secret = secret % 16777216n;

    const s3 = secret * 2048n;
    secret = secret ^ s3;
    secret = secret % 16777216n;
  }

  console.log(secret);
  sum += (secret);
}
console.log(sum);
