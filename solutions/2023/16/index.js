const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

//direction enum
// 0 = up
// 1 = right
// 2 = down
// 3 = left
const beams = [[0, -1, 1]]
const energized = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false))

//the top left corner is energized
energized[0][0] = true;

let energizedCount = 0;
let failLim = 30;
while (true) {


  let energizedAtStart = energizedCount;

  let currentBeanLen = beams.length;
  for (let i = 0; i < currentBeanLen; i++) {
    const beam = beams[i];
    const [y, x, dir] = beam;

    //if the direction is up
    if (dir == 0) {
      //start at current position and scan up
      for (let i = y - 1; i >= 0; i--) {
        //energize the current position
        if (!energized[i][x]) {
          energizedCount++;
          energized[i][x] = true;
        }

        //empty space or |
        if (grid[i][x] == "." || grid[i][x] == "|") {
          continue;
        }

        //if it's a mirror, change the direction
        if (grid[i][x] == "/") {
          beams.push([i, x, 1]);
          break;
        } else if (grid[i][x] == "\\") {
          beams.push([i, x, 3]);
          break;
        }

        //if its a -, 
        if (grid[i][x] == "-") {
          beams.push([i, x, 1]);
          beams.push([i, x, 3]);
          break;
        }
      }
    }

    //if the direction is down
    else if (dir == 2) {
      //start at current position and scan down
      for (let i = y + 1; i < grid.length; i++) {
        //energize the current position
        if (!energized[i][x]) {
          energizedCount++;
          energized[i][x] = true;
        }

        //empty space or |
        if (grid[i][x] == "." || grid[i][x] == "|") {
          continue;
        }

        //if it's a mirror, change the direction
        if (grid[i][x] == "/") {
          beams.push([i, x, 3]);
          break;
        } else if (grid[i][x] == "\\") {
          beams.push([i, x, 1]);
          break;
        }

        //if its a -, 
        if (grid[i][x] == "-") {
          beams.push([i, x, 1]);
          beams.push([i, x, 3]);
          break;
        }
      }
    }

    //if the direction is right
    else if (dir == 1) {
      //start at current position and scan right
      for (let i = x + 1; i < grid[0].length; i++) {
        //energize the current position
        if (!energized[y][i]) {
          energizedCount++;
          energized[y][i] = true;
        }

        //empty space or |
        if (grid[y][i] == "." || grid[y][i] == "-") {
          continue;
        }

        //if it's a mirror, change the direction
        if (grid[y][i] == "/") {
          beams.push([y, i, 0]);
          break;
        } else if (grid[y][i] == "\\") {
          beams.push([y, i, 2]);
          break;
        }

        //if its a -, 
        if (grid[y][i] == "|") {
          beams.push([y, i, 0]);
          beams.push([y, i, 2]);
          break;
        }
      }
    }

    //if the direction is left
    else if (dir == 3) {
      //start at current position and scan left
      for (let i = x - 1; i >= 0; i--) {
        //energize the current position
        if (!energized[y][i]) {
          energizedCount++;
          energized[y][i] = true;
        }

        //empty space or |
        if (grid[y][i] == "." || grid[y][i] == "-") {
          continue;
        }

        //if it's a mirror, change the direction
        if (grid[y][i] == "/") {
          beams.push([y, i, 2]);
          break;
        } else if (grid[y][i] == "\\") {
          beams.push([y, i, 0]);
          break;
        }

        //if its a -, 
        if (grid[y][i] == "|") {
          beams.push([y, i, 0]);
          beams.push([y, i, 2]);
          break;
        }
      }
    }
  }

  //remove all duplicates
  console.log(beams.length);
  beams.sort((a, b) => {
    if (a[0] == b[0]) {
      if (a[1] == b[1]) {
        return a[2] - b[2];
      }
      return a[1] - b[1];
    }
    return a[0] - b[0];
  });


  for (let i = 0; i < beams.length - 1; i++) {
    if (beams[i][0] == beams[i + 1][0] && beams[i][1] == beams[i + 1][1] && beams[i][2] == beams[i + 1][2]) {
      beams.splice(i, 1);
      i--;
    }
  }

  console.log(beams.length);

  //print the grid
  for (let i = 0; i < grid.length; i++) {
    let line = "";
    for (let j = 0; j < grid[0].length; j++) {
      if (energized[i][j]) {
        line += "X";
      } else {
        line += grid[i][j];
      }
    }
    console.log(line);
  }

  console.log("energized count: " + energizedCount);
  console.log("energized at start: " + energizedAtStart);


  //if we didn't energize anything, we're done
  if (energizedAtStart == energizedCount) {
    failLim--;
  }

  if (failLim <= 0) {
    break;
  }
}


//count how many are energized
console.log(energizedCount + 1);
