const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const entries = input.map((entry) => {
  const [_, __, colorRaw] = entry.split(" ");

  const color = colorRaw.replace("(#", "").replace(")", "");

  //parse the color as hex
  const colorHex = parseInt(color.slice(0, 5), 16);
  const dir = parseInt(color[5]);

  return { dir, length: colorHex }
});

const points = [[0, 0]];

for (const entry of entries) {
  const { dir, length } = entry;

  const lastPoint = points[points.length - 1];

  if (dir === 3) {
    points.push([lastPoint[0], lastPoint[1] + length]);
  }
  else if (dir === 1) {
    points.push([lastPoint[0], lastPoint[1] - length]);
  }
  else if (dir === 2) {
    points.push([lastPoint[0] - length, lastPoint[1]]);
  }
  else if (dir === 0) {
    points.push([lastPoint[0] + length, lastPoint[1]]);
  }
}


//how many tiles does the path go through?
let tiles = 0;
for (let i = 0; i < points.length - 1; i++) {
  const point = points[i];
  const nextPoint = points[i + 1];

  const x1 = point[0];
  const y1 = point[1];

  const x2 = nextPoint[0];
  const y2 = nextPoint[1];

  if (x1 === x2) {
    tiles += Math.abs(y2 - y1);
  }
  else if (y1 === y2) {
    tiles += Math.abs(x2 - x1);
  }
  else {
    tiles += Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }
}


function shoelaceTheorem(points) {
  var n = points.length;
  var area = 0;
  for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  return Math.abs(area / 2);
}


function picksTheorem(points) {
  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  var n = points.length;
  var area = shoelaceTheorem(points);
  var boundary = 0;
  for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    boundary += gcd(Math.abs(points[i][0] - points[j][0]), Math.abs(points[i][1] - points[j][1]));
  }
  return Math.round(area - boundary / 2 + 1);
}

const pointCount = picksTheorem(points);
const value = (BigInt(pointCount) + BigInt(tiles)).toString();

//remove the "n" from the end of the number
const answer = value.slice(0, value.length - 1);
console.log(answer);