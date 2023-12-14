const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").slice(0, -1)


//separate into individual grids
const grids = input.split("\n\n")

function isSymmetricHori(grid, lineOfInterest) {
  //the line of interest defines the leftmost column of the pair

  const leftColsCount = lineOfInterest + 1
  const rightColsCount = grid.length - leftColsCount

  const checkCount = Math.min(leftColsCount, rightColsCount)

  if (checkCount <= 0) return false

  for (let i = 0; i < checkCount; i++) {
    if (grid[lineOfInterest - i] == undefined || grid[lineOfInterest + i + 1] == undefined) {
      return false
    }
    if (grid[lineOfInterest - i] != grid[lineOfInterest + i + 1]) {
      return false
    }
  }

  return true
}

function isSymmetricVer(grid, lineOfInterest) {
  //the line of interest defines the topmost row of the pair

  const topRowsCount = lineOfInterest + 1
  const bottomRowsCount = grid[0].length - topRowsCount

  const checkCount = Math.min(topRowsCount, bottomRowsCount)

  if (checkCount <= 0) return false

  for (let i = 0; i < checkCount; i++) {
    let char1 = "", char2 = "";
    for (let j = 0; j < grid.length; j++) {
      char1 += grid[j][lineOfInterest - i]
      char2 += grid[j][lineOfInterest + i + 1]

      if (grid[j][lineOfInterest - i] == undefined || grid[j][lineOfInterest + i + 1] == undefined) return false

    }

    if (char1 != char2) {
      return false
    }
  }

  return true
}

let count = 0

for (const grid of grids) {
  const gridArr = grid.split("\n")

  const width = gridArr[0].length
  const height = gridArr.length


  let horSymm = -2;
  for (let i = 0; i <= height; i++) {
    if (isSymmetricHori(gridArr, i)) {
      horSymm = i
    }
  }

  let verSymm = -2;
  for (let i = 0; i <= width; i++) {
    if (isSymmetricVer(gridArr, i)) {
      verSymm = i
    }
  }

  horSymm++;
  verSymm++;

  console.log(horSymm, verSymm)

  if (horSymm > 0) {
    count += 100 * horSymm
  }
  else if (verSymm > 0) {
    count += verSymm
  } else {
    console.log("noSymm")
    console.log(grid)
  }

}

console.log(count)