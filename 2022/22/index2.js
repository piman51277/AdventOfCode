//WARNING: THIS SOLUTION REQUIRES MANUAL INPUT TABLES
//PLEASE SEE THE MD FILE FOR MORE INFORMATION

const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const grid = [];
const gridHeight = 200;

//input input on the grid = 200 lines long
const width = Math.max(
  ...input.slice(0, gridHeight).map((line) => line.length)
);
const height = input.length;

//start reading the input
for (let y = 0; y < height; y++) {
  grid[y] = [];
  for (let x = 0; x < width; x++) {
    const tile = input[y][x];

    if (tile == undefined || tile == " ") {
      grid[y][x] = -1;
    } else if (tile == "#") {
      grid[y][x] = 1;
    } else if (tile == ".") {
      grid[y][x] = 0;
    }
  }
}

function VectorAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

//FIXME: THIS CHANGES DEPENDING ON THE INPUT
//blocks of of size 50x50
const faceDefinitions = {
  0: {
    x: [50, 99],
    y: [0, 49],
  },
  1: {
    x: [100, 149],
    y: [0, 49],
  },
  2: {
    x: [50, 99],
    y: [50, 99],
  },
  3: {
    x: [0, 49],
    y: [100, 149],
  },
  4: {
    x: [50, 99],
    y: [100, 149],
  },
  5: {
    x: [0, 49],
    y: [150, 199],
  },
};

const faceEdges = {};
for (const face in faceDefinitions) {
  const [xMin, xMax] = faceDefinitions[face].x;
  const [yMin, yMax] = faceDefinitions[face].y;

  faceEdges[face] = {
    up: [
      [xMin, yMin],
      [xMax, yMin],
    ],
    left: [
      [xMin, yMin],
      [xMin, yMax],
    ],
    right: [
      [xMax, yMin],
      [xMax, yMax],
    ],
    down: [
      [xMin, yMax],
      [xMax, yMax],
    ],
  };
}

//FIXME: THIS CHANGES DEPENDING ON THE INPUT
//warp instructions
//further instructions will be in the following format
//<starting face> <orientation> <ending face> <orientation>
const warpInstructionsRaw = `
0 up 5 right
0 right 1 right
0 down 2 down
0 left 3 right
1 up 5 up
1 right 4 left
1 down 2 left
1 left 0 left
2 up 0 up
2 right 1 up
2 down 4 down
2 left 3 down
3 up 2 right
3 right 4 right
3 down 5 down
3 left 0 right
4 up 2 up
4 right 1 left
4 down 5 left
4 left 3 left
5 up 3 up
5 right 4 up
5 down 1 down
5 left 0 down
`;

const warpInstructions = {};
for (const instruction of warpInstructionsRaw.split("\n")) {
  const [startFace, startOrientation, endFace, endOrientation] =
    instruction.split(" ");
  warpInstructions[startFace + startOrientation] = {
    endFace,
    endOrientation,
  };
}

//this table is always the same
const warpEdgeBehavior = {
  up: {
    up: 1,
    left: -1,
    right: 1,
    down: -1,
  },
  left: {
    up: -1,
    left: 1,
    right: -1,
    down: 1,
  },
  right: {
    up: 1,
    left: -1,
    right: 1,
    down: -1,
  },
  down: {
    up: -1,
    left: 1,
    right: -1,
    down: 1,
  },
};

function getOppositeOrientation(orientation) {
  switch (orientation) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
  }
}

function normalizeVector(vector) {
  const [x, y] = vector;
  const length = Math.sqrt(x * x + y * y);
  return [x / length, y / length];
}

function getFace(position) {
  const [x, y] = position;
  for (const face in faceDefinitions) {
    const [xMin, xMax] = faceDefinitions[face].x;
    const [yMin, yMax] = faceDefinitions[face].y;

    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      return face;
    }
  }
}

function isOnFaceEdge(position) {
  const [x, y] = position;
  const face = getFace(position);
  const [xMin, xMax] = faceDefinitions[face].x;
  const [yMin, yMax] = faceDefinitions[face].y;

  if (x == xMin || x == xMax || y == yMin || y == yMax) {
    return true;
  }
}

function getOnEdges(position) {
  const [x, y] = position;
  const face = getFace(position);
  const [xMin, xMax] = faceDefinitions[face].x;
  const [yMin, yMax] = faceDefinitions[face].y;

  //we can return multipel values
  const matches = [];
  if (x == xMin) {
    matches.push("left");
  }
  if (x == xMax) {
    matches.push("right");
  }
  if (y == yMin) {
    matches.push("up");
  }
  if (y == yMax) {
    matches.push("down");
  }
  return matches;
}

//get warp coordinates
function getWarp(position, orientation) {
  const face = getFace(position);

  //get general warp instruction
  //this tells us which face we're going to warp to
  const warpInstruction = warpInstructions[face + orientation];

  const { endFace, endOrientation } = warpInstruction;

  //if the orientations are the same, we do not need to worry about coordinate shift
  // if (orientation == endOrientation) {
  //find out how far along we are on the edge
  const [startEdge] = faceEdges[face][orientation];

  //get the distance along the edge
  const distance =
    Math.abs(startEdge[0] - position[0]) + Math.abs(startEdge[1] - position[1]);

  //get the end edge
  //the other edge will be the opposite of orientatio
  const [endStartEdge, endEndEdge] =
    faceEdges[endFace][getOppositeOrientation(endOrientation)];

  //get the new position
  const warpEdgeBehaviorValue = warpEdgeBehavior[orientation][endOrientation];
  const unitDelta = normalizeVector([
    endEndEdge[0] - endStartEdge[0],
    endEndEdge[1] - endStartEdge[1],
  ]);

  //if the warpEdgeBehaviorValue is 1, we're going in the same direction
  //if it's -1, we're going in the opposite direction
  let newPosition = [0, 0];

  if (warpEdgeBehaviorValue == 1) {
    newPosition = [
      endStartEdge[0] + unitDelta[0] * distance,
      endStartEdge[1] + unitDelta[1] * distance,
    ];
  } else {
    newPosition = [
      endEndEdge[0] - unitDelta[0] * distance,
      endEndEdge[1] - unitDelta[1] * distance,
    ];
  }


  return [newPosition, endOrientation];
  //}
}

function visualizeGrid() {
  let output = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x == position[0] && y == position[1]) {
        //add additiona info based on facing
        if (facing == "up") {
          output += "^";
        }
        if (facing == "down") {
          output += "v";
        }
        if (facing == "left") {
          output += "<";
        }
        if (facing == "right") {
          output += ">";
        }
      } else if (grid[y][x] == 1) {
        output += "#";
      } else if (grid[y][x] == 0) {
        output += ".";
      } else if (grid[y][x] == -1) {
        output += " ";
      }
    }
    output += "\n";
  }
  console.log(output);
}

function getMovementDelta(orientation) {
  switch (orientation) {
    case "up":
      return [0, -1];
    case "down":
      return [0, 1];
    case "left":
      return [-1, 0];
    case "right":
      return [1, 0];
  }
}

//get the list of instructions
const instructions = input[gridHeight + 1].split(/(L|R)/g);

//figure out the initial position
const directions = ["up", "left", "down", "right"];
let facing = "right";
//find the x and y of the starting position
let position = [grid[0].indexOf(0), 0];

for (const instruction of instructions) {
  if (instruction == "L") {
    facing = directions[(directions.indexOf(facing) + 1) % 4];
    continue;
  } else if (instruction == "R") {
    facing = directions[(directions.indexOf(facing) + 3) % 4];
    continue;
  }

  //it's a move instruction
  const distance = parseInt(instruction);
  let movementDelta = getMovementDelta(facing);

  for (let k = 0; k < distance; k++) {
    let nextPosition = VectorAdd(position, movementDelta);
    let nextfacing = null;

    //if we are on the edge of a face, we need to warp
    if (isOnFaceEdge(position)) {
      const onEdges = getOnEdges(position);

      //and we are in the right orientation
      if (onEdges.includes(facing)) {
        [nextPosition, nextfacing] = getWarp(position, facing);

        //we need to update the movement delta
        movementDelta = getMovementDelta(nextfacing || facing);
      }
    }

    //if the next position is a wall, we need to stop
    if (grid[nextPosition[1]][nextPosition[0]] == 1) {
      break;
    }

    position = nextPosition;
    facing = nextfacing || facing;

  }
}

const finalRow = position[1] + 1;
const finalColumn = position[0] + 1;
const facingValue = ["right", "down", "left", "up"].indexOf(facing);
console.log(1000 * finalRow + 4 * finalColumn + facingValue);
