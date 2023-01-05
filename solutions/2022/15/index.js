const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

class Sensor {
  constructor(x, y, bx, by) {
    this.x = x;
    this.y = y;
    this.bx = bx;
    this.by = by;
    this.distance = manhattanDistance(this, { x: bx, y: by });
  }
}

const beacons = [];
const sensors = [];
for (const line of input) {
  const args = line.split(" ");
  const x = parseInt(args[2].split("=")[1].replace(",", ""));
  const y = parseInt(args[3].split("=")[1].replace(":", ""));
  const bx = parseInt(args[8].split("=")[1].replace(",", ""));
  const by = parseInt(args[9].split("=")[1]);

  sensors.push(new Sensor(x, y, bx, by));

  //check if beacon is already in the list
  const beacon = beacons.find((b) => b.x === bx && b.y === by);
  if (beacon) {
    continue;
  }
  beacons.push({ x: bx, y: by });
}
const y = 2000000;

let ranges = [];

//compute the ranges of values each sensor can cover at the y value
for (const sensor of sensors) {
  //each sensor is manhattan distance away from the beacon

  const distanceDown = manhattanDistance(sensor, { x: sensor.x, y: y });

  //if the distance down is greater than the distance to the beacon, the sensor cannot cover any values
  if (distanceDown > sensor.distance) {
    continue;
  }

  const x1 = sensor.x - (sensor.distance - distanceDown);
  const x2 = sensor.x + (sensor.distance - distanceDown);

  ranges.push([Math.min(x1, x2), Math.max(x1, x2)]);
}

console.log(ranges);

//merge ranges that overlap
let mergedRanges = [];
let workingRange = ranges.pop();

while (ranges.length > 0) {
  const tomerge = [];
  for (const range of ranges) {
    //if there are ranges that end after the working range starts
    if (range[1] >= workingRange[0]) {
      tomerge.push(range);
    }

    //if there are ranges that start before the working range ends
    else if (range[0] <= workingRange[1]) {
      tomerge.push(range);
    }
  }

  //if there are no ranges to merge, add the working range to the merged ranges and start a new working range
  if (tomerge.length === 0) {
    mergedRanges.push(workingRange);
    workingRange = ranges.pop();
    continue;
  }

  //remove the ranges that were merged
  for (const range of tomerge) {
    ranges.splice(ranges.indexOf(range), 1);
  }

  //merge the ranges
  let min = Math.min(workingRange[0], ...tomerge.map((r) => r[0]));
  let max = Math.max(workingRange[1], ...tomerge.map((r) => r[1]));

  workingRange = [min, max];
}
mergedRanges.push(workingRange);

console.log(mergedRanges);

//find the number of beacons at the y p
let count = 0;
for (const beacon of beacons) {
  if (beacon.y === y) {
    count++;
  }
}

//find the number of positions in the range
let positions = 0;
for (const range of mergedRanges) {
  positions += range[1] - range[0] + 1;
}

//remove the number of beacons from the number of positions
positions -= count;

console.log(positions);
