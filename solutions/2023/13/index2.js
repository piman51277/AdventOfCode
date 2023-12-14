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


function getReflects(grid, ignore = -1, ignoreD = false, ignoreT = -3) {
  const gridArr = grid.split("\n")

  const width = gridArr[0].length
  const height = gridArr.length

  let hPoss = []

  for (let i = 0; i <= height; i++) {
    if (isSymmetricHori(gridArr, i)) {
      hPoss.push(i + 1)
    }
  }

  let vPoss = []
  for (let i = 0; i <= width; i++) {
    if (isSymmetricVer(gridArr, i)) {
      vPoss.push(i + 1)
    }
  }


  //look through all hpos
  if (ignore) {
    //return the first hpos or vpos that is not the ignore
    for (const hpos of hPoss) {
      if (hpos != ignoreT) {
        return [true, hpos]
      }
      else if (ignoreD == false) {
        return [true, hpos]
      }
    }
    for (const vpos of vPoss) {
      if (vpos != ignoreT) {
        return [false, vpos]
      }
      else if (ignoreD == true) {
        return [false, vpos]
      }
    }
  }

  if (hPoss.length > 0) {
    return [true, hPoss[0]]
  }
  else if (vPoss.length > 0) {
    return [false, vPoss[0]]
  } else {
    return [false, -10]
  }
}

let count = 0

for (const grid of grids) {

  //umod
  const [unmodT, unmodL] = getReflects(grid)

  console.log(unmodT ? "hor" : "ver", unmodL)

  //for every char
  let modded = false;
  for (let i = 0; i < grid.length; i++) {
    //make a copy of the grid
    let gridCopy = grid

    //flip a char from # to . or vice versa at index i
    const charAtPos = gridCopy[i]
    const flippedChar = charAtPos == "#" ? "." : "#"
    if (charAtPos != "\n")
      gridCopy = gridCopy.slice(0, i) + flippedChar + gridCopy.slice(i + 1)


    //check if it reflects
    const [reflects, length] = getReflects(gridCopy, true, unmodT, unmodL)


    if (reflects == false && length == -10) {
      continue;
    }

    if (reflects == unmodT && length == unmodL) {
      continue;
    }

    //if it does, add to count
    if (reflects) {
      count += 100 * length
      modded = true;
      break;
    }
    else {
      count += length
      modded = true;
      break;
    }
  }

  if (modded) continue;

  console.log(grid)
  console.log("FUCKKKKK");
  console.log(unmodT ? "hor" : "ver", unmodL)

}

console.log(count)