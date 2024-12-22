const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();
const cl = console.log;
const pricesList = [];
const diffsList = [];
for (const line of input) {
  let secret = BigInt(parseInt(line));
  const prices = [secret % 10n];
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
    prices.push(secret % 10n);
  }
  const diffs = prices.map((price, i) => {
    if (i === 0) return price;
    return price - prices[i - 1];
  });
  pricesList.push(prices);
  diffsList.push(diffs);
}
let bestSums = {};
for (let i = 0; i < diffsList.length; i++) {
  const diffs = diffsList[i];
  //get all existing 4 sequences
  const seen = new Set();
  for (let j = 0; j < diffs.length - 3; j++) {
    const val = diffs.slice(j, j + 4).join(",");
    if (seen.has(val)) continue;
    seen.add(val);
    if (!bestSums[val]) {
      bestSums[val] = 0;
    }
    bestSums[val] += Number(pricesList[i][j + 3]);
  }
}

for (const dfif of diffsList) {
  console.log(
    dfif
      .slice(0, 30)
      .map((n) => n.toString().padStart(2, " "))
      .join(" ")
  );
}

const entries = Object.entries(bestSums);
entries.sort((a, b) => b[1] - a[1]);
console.log(entries[0][1]);
