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

const CORRMAX = 4000000;

for (let y = 0; y < CORRMAX; y++) {
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

  //merge ranges that overlap
  let mergedRanges = [];
  let workingRange = ranges.pop();

  while (ranges.length > 0) {
    const tomerge = [];
    for (const range of ranges) {
      //if there are ranges that end after the working range starts
      if (range[1] >= workingRange[0] && range[0] <= workingRange[0]) {
        tomerge.push(range);
      }

      //if there are ranges that start before the working range ends
      else if (range[0] <= workingRange[1] && range[1] >= workingRange[1]) {
        tomerge.push(range);
      }

      //if there are ranges that are completley inside the working range
      else if (range[0] >= workingRange[0] && range[1] <= workingRange[1]) {
        tomerge.push(range);
      }

      //if there are ranges that include
      else if (range[0] <= workingRange[0] && range[1] >= workingRange[1]) {
        tomerge.push(range);
      }

      //check if there are ranges that touch the working range
      else if (range[0] === workingRange[1] + 1) {
        tomerge.push(range);
      } else if (range[1] === workingRange[0] - 1) {
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

  //check if the merged ranges cover [0, CORRMAX]
  for (const range of mergedRanges) {
    if (range[0] <= 0 && range[1] >= CORRMAX) {
      continue;
    }
  }

  //they dont!, which position do that not cover?

  //sort the ranges by their start value
  mergedRanges = mergedRanges.sort((a, b) => a[0] - b[0]);

  //get the differnece in start and end values between the ranges
  let gaps = [];
  for (let i = 0; i < mergedRanges.length - 1; i++) {
    for (let j = mergedRanges[i][1] + 1; j < mergedRanges[i + 1][0]; j++) {
      gaps.push(j);
    }
  }

  //if there is a gap
  if (gaps.length > 0) {
    console.log(gaps[0] * 4000000 + y);
    break;
  }

  if (mergedRanges.length >= 2) {
    console.log(y);
    break;
  }
}
