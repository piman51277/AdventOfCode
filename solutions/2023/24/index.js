const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

function getRegexMatches(regex, string) {
  return Array.from(string.matchAll(regex));
}

const hailstones = [];
for (const line of input) {
  //format 20, 19, 15 @  1, -5, -3
  const [x, y, z, vx, vy, vz] = line.match(/-?\d+/g).map(Number);

  hailstones.push({
    x, y, z,
    vx, vy, vz
  });
}

const coord_min = 200000000000000
const coord_max = 400000000000000

//gets intersection point of two lines segements
function getIntersectionPoint(start1, end1, start2, end2) {
  const dir1 = [end1[0] - start1[0], end1[1] - start1[1]];
  const dir2 = [end2[0] - start2[0], end2[1] - start2[1]];

  //get determinant
  const det = dir1[0] * dir2[1] - dir1[1] * dir2[0];
  if (det === 0) return null;

  //get t values
  const t1 = (dir2[0] * (start1[1] - start2[1]) - dir2[1] * (start1[0] - start2[0])) / det;
  const t2 = (dir1[0] * (start1[1] - start2[1]) - dir1[1] * (start1[0] - start2[0])) / det;

  //check if t values are within bounds
  if (t1 < 0 || t1 > 1 || t2 < 0 || t2 > 1) return null;

  //return intersection point
  return [start1[0] + dir1[0] * t1, start1[1] + dir1[1] * t1];
}



let collides = 0;




//look for collisions in x-y plane
for (let i = 0; i < hailstones.length; i++) {
  for (let j = i + 1; j < hailstones.length; j++) {
    const h1 = hailstones[i];
    const h2 = hailstones[j];

    const x1 = [h1.x, h1.y];
    const x2 = [h1.x + h1.vx * 10000000000000000000, h1.y + h1.vy * 10000000000000000000];
    const y1 = [h2.x, h2.y];
    const y2 = [h2.x + h2.vx * 10000000000000000000, h2.y + h2.vy * 10000000000000000000];

    //get location of collision(if any)
    const x = getIntersectionPoint(x1, x2, y1, y2);
    if (x) {
      console

      if (x[0] > coord_min && x[0] < coord_max && x[1] > coord_min && x[1] < coord_max) {
        collides++;
      }


    }

  }
}

console.log(collides);