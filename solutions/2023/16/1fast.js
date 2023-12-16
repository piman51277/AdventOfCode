//WARNING! These may fail on some edge cases

const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

//get all positions of /, \, |, and -
const width = grid[0].length
const height = grid.length

const rightslashSet = new Set()
const leftslashSet = new Set()
const vertSet = new Set()
const horizSet = new Set()
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    if (grid[i][j] == "/") {
      rightslashSet.add(i * width + j)
    }
    else if (grid[i][j] == "\\") {
      leftslashSet.add(i * width + j)
    }
    else if (grid[i][j] == "|") {
      vertSet.add(i * width + j)
    }
    else if (grid[i][j] == "-") {
      horizSet.add(i * width + j)
    }
  }
}

const mirrorSet = new Set([...rightslashSet, ...leftslashSet, ...vertSet, ...horizSet])

//direction enum
// 0 = up
// 1 = right
// 2 = down
// 3 = left

//beam ID is (x + y * width) * 10 + dir

function getEnergyForStartingBeam(be) {
  const seenBeams = new Set()
  const beams = [be]
  const energized = Array(height * width).fill(false)

  while (beams.length > 0) {
    const beam = beams.shift();
    const [y, x, dir] = beam;

    //if this is in bounds mark it as energized
    if (y >= 0 && y < height && x >= 0 && x < width && !energized[y * width + x]) {
      energized[y * width + x] = true;
    }

    const newBeams = []

    //if the direction is up
    if (dir == 0) {
      //start at next position and scan up
      for (let i = y; i >= 0; i--) {
        //energize position
        energized[i * width + x] = true;

        //is this a mirror?
        if (mirrorSet.has(i * width + x)) {
          //if it's a mirror, change the direction
          if (rightslashSet.has(i * width + x)) {
            newBeams.push([i, x + 1, 1]);
          } else if (leftslashSet.has(i * width + x)) {
            newBeams.push([i, x - 1, 3]);
          } else if (horizSet.has(i * width + x)) {
            newBeams.push([i, x + 1, 1]);
            newBeams.push([i, x - 1, 3]);
          } else {
            continue
          }
          break;
        }
      }
    }

    //if the direction is down
    else if (dir == 2) {
      //start at next position and scan down
      for (let i = y; i < height; i++) {
        //energize position
        energized[i * width + x] = true;

        //is this a mirror?
        if (mirrorSet.has(i * width + x)) {
          //if it's a mirror, change the direction
          if (rightslashSet.has(i * width + x)) {
            newBeams.push([i, x - 1, 3]);
          } else if (leftslashSet.has(i * width + x)) {
            newBeams.push([i, x + 1, 1]);
          } else if (horizSet.has(i * width + x)) {
            newBeams.push([i, x + 1, 1]);
            newBeams.push([i, x - 1, 3]);
          } else {
            continue
          }
          break;
        }
      }
    }

    //if the direction is right
    else if (dir == 1) {
      //start at next position and scan right
      for (let i = x; i < width; i++) {
        //energize position
        energized[y * width + i] = true;

        //is this a mirror?
        if (mirrorSet.has(y * width + i)) {
          //if it's a mirror, change the direction
          if (rightslashSet.has(y * width + i)) {
            newBeams.push([y - 1, i, 0]);
          } else if (leftslashSet.has(y * width + i)) {
            newBeams.push([y + 1, i, 2]);
          } else if (vertSet.has(y * width + i)) {
            newBeams.push([y - 1, i, 0]);
            newBeams.push([y + 1, i, 2]);
          } else {
            continue
          }
          break;
        }
      }
    }

    //if the direction is left
    else if (dir == 3) {
      //start at next position and scan left
      for (let i = x; i >= 0; i--) {
        //energize position
        energized[y * width + i] = true;

        //is this a mirror?
        if (mirrorSet.has(y * width + i)) {
          //if it's a mirror, change the direction
          if (rightslashSet.has(y * width + i)) {
            newBeams.push([y + 1, i, 2]);
          } else if (leftslashSet.has(y * width + i)) {
            newBeams.push([y - 1, i, 0]);
          } else if (vertSet.has(y * width + i)) {
            newBeams.push([y - 1, i, 0]);
            newBeams.push([y + 1, i, 2]);
          } else {
            continue
          }
          break;
        }
      }
    }


    //add new beams to the queue
    for (const beam of newBeams) {
      //cull all OOB beams
      if (beam[0] < 0 || beam[0] >= height || beam[1] < 0 || beam[1] >= width) {
        continue
      }

      const beamID = (beam[0] * width + beam[1]) * 10 + beam[2]
      if (!seenBeams.has(beamID)) {
        seenBeams.add(beamID)
        beams.push(beam)
      }
    }
  }

  let count = 0
  for (const e of energized) {
    if (e) {
      count++
    }
  }
  return count;
}

console.log(getEnergyForStartingBeam([0, -1, 1]))