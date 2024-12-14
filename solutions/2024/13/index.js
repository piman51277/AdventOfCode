const fs = require("fs");
const inputCases = fs.readFileSync("input.txt", "utf8").split("\n\n");

function extractValues(iLine) {
  iLine = iLine.replace(/=/g, "+");
  const [_, l] = iLine.split(": ");
  const [xr, yr] = l.split(", ");
  const x = eval(`0${xr.slice(1)}`);
  const y = eval(`0${yr.slice(1)}`);
  return { x, y };
}

const cases = [];
for (const inputCase of inputCases) {
  const [a, b, p] = inputCase.split("\n");
  cases.push({
    a: extractValues(a),
    b: extractValues(b),
    p: extractValues(p),
  });
}

function isInteger(n) {
  return n % 1 < 0.0000001;
}

function areVecSame(a, b) {
  let aRatio = a.x / a.y;
  let bRatio = b.x / b.y;

  if (Math.abs(aRatio - bRatio) < 0.0000001) {
    return true;
  }
}

let tokens = 0;

for (const ca of cases) {
  const { a, b, p } = ca;

  if (areVecSame(a, b)) {
    console.log("same");
  }

  //eq 1: ax * h + bx * k = px
  //eq 2: ay * h + by * k = py

  //h = (px - bx * k) / ax
  //ay* ((px - bx * k) / ax) + by * k = py
  //k = (axpy - aypx) / (axby - aybx)
  const k = (a.x * p.y - a.y * p.x) / (a.x * b.y - a.y * b.x);
  const h = (p.x - b.x * k) / a.x;

  //console.log(h, k);

  if (isInteger(h) && isInteger(k)) {
    tokens += h * 3 + k;
  }
}
console.log(tokens);
