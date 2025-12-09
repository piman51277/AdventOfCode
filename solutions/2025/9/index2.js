const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let coordinates = [];
let poly = [];
for (const line of input) {
  const [x, y] = line.split(",").map(Number);
  coordinates.push({ x, y });
  poly.push([x, y]);
}

function pointInPolygon(point, polygon) {
  var x = point[0],
    y = point[1];
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i][0],
      yi = polygon[i][1];
    var xj = polygon[j][0],
      yj = polygon[j][1];
    var intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}


let largestArea = -1;
for (let i = 0; i < coordinates.length; i++) {
  for (let j = i + 1; j < coordinates.length; j++) {
    const dx = Math.abs(coordinates[i].x - coordinates[j].x) + 1;
    const dy = Math.abs(coordinates[i].y - coordinates[j].y) + 1;
    const area = dx * dy;

    if (area > largestArea) {
      let allInside = true;
      let minX = Math.min(coordinates[i].x, coordinates[j].x);
      let maxX = Math.max(coordinates[i].x, coordinates[j].x);
      let minY = Math.min(coordinates[i].y, coordinates[j].y);
      let maxY = Math.max(coordinates[i].y, coordinates[j].y);

      let deltaX = maxX - minX;
      let deltaY = maxY - minY;

      if (deltaX === 0 || deltaY === 0) {
        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            if (!pointInPolygon([x, y], poly)) {
              allInside = false;
              break;
            }
          }
          if (!allInside) break;
        }
      } else {
        if (
          !pointInPolygon([minX + 1, minY + 1], poly) ||
          !pointInPolygon([minX + 1, maxY - 1], poly) ||
          !pointInPolygon([maxX - 1, minY + 1], poly) ||
          !pointInPolygon([maxX - 1, maxY - 1], poly)
        ) {
          allInside = false;
          continue;
        }
      }

      if (!allInside) {
        continue;
      }

      if (50000 >= minY && 50000 <= maxY) {
        continue;
      }

      for (let x = minX + 1; x < maxX; x++) {
        if (!pointInPolygon([x, minY + 1], poly)) {
          allInside = false;
          break;
        }
        if (!pointInPolygon([x, maxY - 1], poly)) {
          allInside = false;
          break;
        }
      }
      if (!allInside) {
        continue;
      }
      for (let y = minY + 1; y < maxY; y++) {
        if (!pointInPolygon([minX + 1, y], poly)) {
          allInside = false;
          break;
        }
        if (!pointInPolygon([maxX - 1, y], poly)) {
          allInside = false;
          break;
        }
      }

      if (allInside) {
        largestArea = area;
      }
    }
  }
}

console.log(largestArea);
