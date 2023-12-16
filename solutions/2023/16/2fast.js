//WARNING! These may fail on some edge cases

const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

//get all positions of /, \, |, and -
const width = grid[0].length
const height = grid.length


const mirrorSet = new Map()
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    if (grid[i][j] == "/") {
      mirrorSet.set(i * width + j, 0)
    }
    else if (grid[i][j] == "\\") {
      mirrorSet.set(i * width + j, 1)
    }
    else if (grid[i][j] == "|") {
      mirrorSet.set(i * width + j, 2)
    }
    else if (grid[i][j] == "-") {
      mirrorSet.set(i * width + j, 3)
    }
  }
}


//direction enum
// 0 = up
// 1 = right
// 2 = down
// 3 = left

//beam ID is (x + y * width) * 10 + dir

const globalSeenBeams = new Set()
const beamEnergized = new Map()
const beamChildren = new Map()


function getEnergyForStartingBeam(be) {
  const seenBeams = new Set()
  const beams = [(be[0] * width + be[1]) * 10 + be[2]]
  const energized = Array(height * width).fill(false)

  while (beams.length > 0) {
    const beam = beams.shift();
    if (globalSeenBeams.has(beam)) {
      seenBeams.add(beam)
      //mark all energized
      const energizedPositions = beamEnergized.get(beam)
      for (let i = 0; i < energizedPositions.length; i++) {
        energized[energizedPositions[i]] = true
      }

      const children = beamChildren.get(beam)
      for (let i = 0; i < children.length; i++) {
        const childID = children[i]
        if (!seenBeams.has(childID))
          beams.push(childID)
      }

      continue
    }

    const dir = beam % 10
    const x = Math.floor((beam / 10) % width)
    const y = Math.floor((beam / 10) / width)


    const newBeams = []
    const energizedPositions = []

    //if the direction is up
    if (dir == 0) {
      //start at next position and scan up
      for (let i = y; i >= 0; i--) {
        //energize position
        const offset = i * width
        energized[offset + x] = true;
        energizedPositions.push(offset + x)

        //is this a mirror?
        if (mirrorSet.has(offset + x)) {
          //if it's a mirror, change the direction
          const isOKLeft = x > 0
          const isOKRight = x < width - 1
          const type = mirrorSet.get(offset + x)
          if (type == 0 && isOKRight) {
            newBeams.push((offset + (x + 1)) * 10 + 1);
          } else if (type == 1 && isOKLeft) {
            newBeams.push((offset + (x - 1)) * 10 + 3);
          } else if (type == 3) {
            if (isOKRight)
              newBeams.push((offset + (x + 1)) * 10 + 1);
            if (isOKLeft)
              newBeams.push((offset + (x - 1)) * 10 + 3);
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
        const offset = i * width
        energized[offset + x] = true;
        energizedPositions.push(offset + x)

        //is this a mirror?
        if (mirrorSet.has(offset + x)) {
          //if it's a mirror, change the direction
          const isOKLeft = x > 0
          const isOKRight = x < width - 1
          const type = mirrorSet.get(offset + x)
          if (type == 0 && isOKLeft) {
            newBeams.push((offset + (x - 1)) * 10 + 3);
          }
          else if (type == 1 && isOKRight) {
            newBeams.push((offset + (x + 1)) * 10 + 1);
          }
          else if (type == 3) {
            if (isOKRight)
              newBeams.push((offset + (x + 1)) * 10 + 1);
            if (isOKLeft)
              newBeams.push((offset + (x - 1)) * 10 + 3);
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
        const offset = y * width
        energized[offset + i] = true;
        energizedPositions.push(offset + i)

        //is this a mirror?
        if (mirrorSet.has(offset + i)) {
          //if it's a mirror, change the direction
          const isOKUp = y > 0
          const isOKDown = y < height - 1
          const type = mirrorSet.get(offset + i)
          if (type == 0 && isOKUp) {
            newBeams.push((offset - width + i) * 10);
          } else if (type == 1 && isOKDown) {
            newBeams.push((offset + width + i) * 10 + 2);
          } else if (type == 2) {
            if (isOKUp)
              newBeams.push((offset - width + i) * 10);
            if (isOKDown)
              newBeams.push((offset + width + i) * 10 + 2);
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
        const offset = y * width
        energized[offset + i] = true;
        energizedPositions.push(offset + i)

        //is this a mirror?
        if (mirrorSet.has(offset + i)) {
          //if it's a mirror, change the direction
          const isOKUp = y > 0
          const isOKDown = y < height - 1
          const type = mirrorSet.get(offset + i)
          if (type == 0 && isOKDown) {
            newBeams.push((offset + width + i) * 10 + 2);
          } else if (type == 1 && isOKUp) {
            newBeams.push((offset - width + i) * 10);
          } else if (type == 2) {
            if (isOKUp)
              newBeams.push((offset - width + i) * 10);
            if (isOKDown)
              newBeams.push((offset + width + i) * 10 + 2);
          } else {
            continue
          }
          break;
        }
      }
    }

    //add new beams to the queue
    let sanitizedNewBeams = []
    for (let i = 0; i < newBeams.length; i++) {
      let beamID = newBeams[i]

      sanitizedNewBeams.push(beamID)
      if (!seenBeams.has(beamID)) {
        seenBeams.add(beamID)
        beams.push(beamID)
      }
    }

    //add to global seen beams
    globalSeenBeams.add(beam)
    beamEnergized.set(beam, energizedPositions)
    beamChildren.set(beam, sanitizedNewBeams)
  }

  let count = 0
  for (const e of energized) {
    if (e) {
      count++
    }
  }
  return count;
}

let tests = []

//left edges
for (let i = 0; i < height; i++) {
  tests.push([i, 0, 1])
}
//right edges
for (let i = 0; i < height; i++) {
  tests.push([i, width - 1, 3])
}
//top edges
for (let i = 0; i < width; i++) {
  tests.push([0, i, 2])
}
//bottom edges
for (let i = 0; i < width; i++) {
  tests.push([height - 1, i, 0])
}


let max = 0
for (let test of tests) {
  const res = getEnergyForStartingBeam(test)
  if (res > max) {
    max = res
  }
}
console.log(max)