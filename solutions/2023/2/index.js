const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()


let validnames = ["red", "green", "blue"]

let count = 0
for (let line of input) {

  //get the game id
  const gameid = parseInt(line.split(" ")[1])

  //remove Game %d: from line
  line = line.replace(/Game \d+: /g, "")

  //separate by semicolon
  cases = line.split(";")


  let colorFreq = {
    "red": 0,
    "green": 0,
    "blue": 0
  }
  for (let _case of cases) {
    const items = _case.split(",")


    for (let item of items) {
      //is it red, green or blue?
      for (let validname of validnames) {
        if (item.includes(validname)) {
          //remove the color from the item
          item = item.replace(validname, "")

          //remove any commas
          item = item.replace(",", "")

          //remove spaces
          item = item.replace(" ", "")

          //parse the number
          const num = parseInt(item)


          //add to the color frequency (max)
          if (colorFreq[validname] === undefined) {
            colorFreq[validname] = num
          } else {
            colorFreq[validname] = Math.max(colorFreq[validname], num)
          }


          break
        }
      }
    }

  }


  if (colorFreq["red"] <= 12 && colorFreq["green"] <= 13 && colorFreq["blue"] <= 14) {
    count += gameid
  }
}
console.log(count)