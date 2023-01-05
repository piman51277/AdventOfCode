const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const rope = [
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
  [500, 500],
];

const grid = [];
for (let i = 0; i < 1000; i++) {
  grid[i] = [];
  for (let j = 0; j < 1000; j++) {
    grid[i][j] = 0;
  }
}

function getTailPos(headx, heady, tailx, taily) {
  //if more than 1 tile away
  if (Math.abs(headx - tailx) > 1 || Math.abs(heady - taily) > 1) {
    if (headx > tailx) tailx++;
    if (headx < tailx) tailx--;
    if (heady > taily) taily++;
    if (heady < taily) taily--;
  }
  return [tailx, taily];
}

grid[500][500] = 1;

for (const line of input) {
  const [direction, distance] = [line[0], parseInt(line.slice(1))];
  switch (direction) {
    case "U":
      for (let i = 0; i < distance; i++) {
        rope[0][1]++;
        //perform tail movement on each link
        for (let j = 0; j < rope.length - 1; j++) {
          const [tailx, taily] = getTailPos(...rope[j], ...rope[j + 1]);
          rope[j + 1] = [tailx, taily];
        }

        const tailx = rope[rope.length - 1][0];
        const taily = rope[rope.length - 1][1];
        grid[tailx][taily] = 1;
      }

      break;
    case "D":
      for (let i = 0; i < distance; i++) {
        rope[0][1]--;
        //perform tail movement on each link
        for (let j = 0; j < rope.length - 1; j++) {
          const [tailx, taily] = getTailPos(...rope[j], ...rope[j + 1]);
          rope[j + 1] = [tailx, taily];
        }

        const tailx = rope[rope.length - 1][0];
        const taily = rope[rope.length - 1][1];
        grid[tailx][taily] = 1;
      }
      break;
    case "R":
      for (let i = 0; i < distance; i++) {
        rope[0][0]++;
        //perform tail movement on each link
        for (let j = 0; j < rope.length - 1; j++) {
          const [tailx, taily] = getTailPos(...rope[j], ...rope[j + 1]);
          rope[j + 1] = [tailx, taily];
        }

        const tailx = rope[rope.length - 1][0];
        const taily = rope[rope.length - 1][1];
        grid[tailx][taily] = 1;
      }
      break;
    case "L":
      for (let i = 0; i < distance; i++) {
        rope[0][0]--;
        //perform tail movement on each link
        for (let j = 0; j < rope.length - 1; j++) {
          const [tailx, taily] = getTailPos(...rope[j], ...rope[j + 1]);
          rope[j + 1] = [tailx, taily];
        }

        const tailx = rope[rope.length - 1][0];
        const taily = rope[rope.length - 1][1];
        grid[tailx][taily] = 1;
      }
      break;
  }
}

// sum the grid
let sum = 0;
for (let i = 0; i < 1000; i++) {
  for (let j = 0; j < 1000; j++) {
    sum += grid[i][j];
  }
}

console.log(sum);
