const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const width = input[0].length - 2;
const height = input.length - 2;
const blizzards = [];
const blizzardStates = [];

for (let i = 1; i <= height; i++) {
  for (let j = 1; j <= width; j++) {
    const char = input[i][j];

    const bilzzards = "<>^v";
    if (bilzzards.includes(char)) {
      blizzards.push({ x: j - 1, y: i - 1, direction: char });
    }
  }
}

function step() {
  for (let i = 0; i < blizzards.length; i++) {
    const blizzard = blizzards[i];

    if (blizzard.direction === ">") {
      //if we go off the edge, we wrap around
      if (blizzard.x === width - 1) {
        blizzard.x = 0;
      } else {
        blizzard.x++;
      }
    } else if (blizzard.direction === "<") {
      if (blizzard.x === 0) {
        blizzard.x = width - 1;
      } else {
        blizzard.x--;
      }
    } else if (blizzard.direction === "^") {
      if (blizzard.y === 0) {
        blizzard.y = height - 1;
      } else {
        blizzard.y--;
      }
    }
    if (blizzard.direction === "v") {
      if (blizzard.y === height - 1) {
        blizzard.y = 0;
      } else {
        blizzard.y++;
      }
    }
  }

  //generate a list of coordinates that have more at least one blizzard
  const blizzardCoordinates = [];
  for (let i = 0; i < blizzards.length; i++) {
    const blizzard = blizzards[i];
    const coordinate = [blizzard.x, blizzard.y];

    const existingCoordinate = blizzardCoordinates.find(
      (c) => c[0] === coordinate[0] && c[1] === coordinate[1]
    );

    if (!existingCoordinate) {
      blizzardCoordinates.push(coordinate);
    }
  }

  blizzardStates.push(blizzardCoordinates);
}

function getPossibilities([x, y], time) {
  //get the blizzard state at the given time
  const nextBlizzardState = blizzardStates[time];

  //check the coordinates of the blizzards in the next state

  //check if there will be a blizzard at the given coordinate
  const noMove = nextBlizzardState.find((c) => c[0] === x && c[1] === y);

  const up = nextBlizzardState.find((c) => c[0] === x && c[1] === y - 1);

  const down = nextBlizzardState.find((c) => c[0] === x && c[1] === y + 1);

  const left = nextBlizzardState.find((c) => c[0] === x - 1 && c[1] === y);

  const right = nextBlizzardState.find((c) => c[0] === x + 1 && c[1] === y);

  const possibilities = [];
  if (!up) {
    possibilities.push([x, y - 1]);
  }

  if (!down) {
    possibilities.push([x, y + 1]);
  }

  if (!left) {
    possibilities.push([x - 1, y]);
  }

  if (!right) {
    possibilities.push([x + 1, y]);
  }

  //if there are no other possibilities, we can't move
  if (!noMove) {
    possibilities.push([x, y]);
  }

  return possibilities;
}

function manhattanDistanceTo([x, y], [x2, y2]) {
  return Math.abs(x - x2) + Math.abs(y - y2);
}

step();

let currentGen = [
  {
    position: [0, -1],
    time: 0,
  },
];
let nextGen = [];
while (true) {
  step();

  //process next generation
  for (let i = 0; i < currentGen.length; i++) {
    const { position, time } = currentGen[i];

    //get the possibilities for the given position and time
    const possibilities = getPossibilities(position, time);

    //filter out anything out of bounds
    const filteredPossibilities = possibilities.filter(
      (p) =>
        (p[0] >= 0 && p[0] < width && p[1] >= 0 && p[1] < height) ||
        (p[0] == 0 && p[1] == -1)
    );

    //add the possibilities to the queue
    for (let i = 0; i < filteredPossibilities.length; i++) {
      nextGen.push({
        position: filteredPossibilities[i],
        time: time + 1,
      });
    }
  }

  //check if we have reached the end
  const hasFinished = nextGen.find(
    (p) => p.position[0] === width - 1 && p.position[1] === height - 1
  );
  if (hasFinished) {
    console.log(hasFinished.time);
    break;
  }

  //get next gen's distance from the end
  nextGen = nextGen.map((p) => {
    p.distance = manhattanDistanceTo(p.position, [width - 1, height - 1]);
    return p;
  });

  //remove duplicates
  nextGen = nextGen.filter((p, i) => {
    const existing = nextGen.find(
      (p2, i2) =>
        i2 < i &&
        p2.position[0] === p.position[0] &&
        p2.position[1] === p.position[1]
    );
    return !existing;
  });

  //sort by distance
  nextGen.sort((a, b) => a.distance - b.distance);

  //get the top 1000
  currentGen = nextGen.slice(0, 1000);
  nextGen = [];
}
