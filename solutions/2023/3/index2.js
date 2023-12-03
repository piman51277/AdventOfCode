const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()


const nummatcher = new RegExp("");

let numberMatchesCoords = []
for (let y = 0; y < input.length; y++) {

  const line = input[y];

  let numerals = Array.from(line.matchAll(/[0-9]+/g), m => m);

  for (const entry of numerals) {

    const numberCoords = [entry]
    const lengt = entry[0].length

    for (let i = 0; i < lengt; i++) {
      numberCoords.push([y, entry.index + i])
    }

    numberMatchesCoords.push(numberCoords)
  }


}

function isSymbol(n) {
  return n == "*"
}

function isCellTouchingSymbol(x, y) {
  if (y > 0 && isSymbol(input[y - 1][x])) return true
  if (y < input.length - 1 && isSymbol(input[y + 1][x])) return true
  if (x > 0 && isSymbol(input[y][x - 1])) return true
  if (x < input[y].length - 1 && isSymbol(input[y][x + 1])) return true

  if (y > 0 && x > 0 && isSymbol(input[y - 1][x - 1])) return true
  if (y > 0 && x < input[y].length - 1 && isSymbol(input[y - 1][x + 1])) return true
  if (y < input.length - 1 && x > 0 && isSymbol(input[y + 1][x - 1])) return true
  if (y < input.length - 1 && x < input[y].length - 1 && isSymbol(input[y + 1][x + 1])) return true

  return false
}

function isCellTouchingLocation(x, y, nx, ny) {
  let deltaX = Math.abs(x - nx)
  let deltaY = Math.abs(y - ny)

  return deltaX <= 1 && deltaY <= 1

}


//find the location of all *s
let starLocations = []

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (input[y][x] === "*") {
      starLocations.push([y, x])
    }
  }
}

//for each star
let sum = 0;
for (const [y, x] of starLocations) {
  //find all numbers that touch this
  let touchingNumbers = []

  for (const number of numberMatchesCoords) {

    let istouching = false
    const [num, ...coords] = number

    for (const [ny, nx] of coords) {
      if (isCellTouchingLocation(nx, ny, x, y,)) {
        istouching = true
        break
      }
    }

    if (istouching) {
      touchingNumbers.push(number)
    }
  }

  //if there are two
  console.log(touchingNumbers.map(n => n[0][0]))
  if (touchingNumbers.length === 2) {

    //multiply them
    sum += touchingNumbers[0][0] * touchingNumbers[1][0]
  }
}

console.log(sum)