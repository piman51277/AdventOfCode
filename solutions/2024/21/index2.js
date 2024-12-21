const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

/** KEYPAD
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
 */

/** I/O BOARD
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+
 */
const ioPositions = {
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 },
  X: { x: 0, y: 3 },
};

const keypadPos = {
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  ">": { x: 2, y: 1 },
  X: { x: 0, y: 0 },
};

function computePathDirections(start, end, keypad) {
  //get loc of forbidden X pos
  let forbiddenX = keypad["X"];

  const neededDirections = [];
  let forbiddenCheckFlag = false;

  //check if the forbidden shares and X with start and Y with end or vice
  if (forbiddenX.x == start.x && forbiddenX.y == end.y) {
    if (start.x < end.x) neededDirections.push(">");
    if (start.x > end.x) neededDirections.push("<");
    if (start.y < end.y) neededDirections.push("v");
    if (start.y > end.y) neededDirections.push("^");
    forbiddenCheckFlag = true;
  } else if (forbiddenX.y == start.y && forbiddenX.x == end.x) {
    if (start.y < end.y) neededDirections.push("v");
    if (start.y > end.y) neededDirections.push("^");
    if (start.x < end.x) neededDirections.push(">");
    if (start.x > end.x) neededDirections.push("<");
    forbiddenCheckFlag = true;
  } else {
    //doesn't matter
    if (start.y < end.y) neededDirections.push("v");
    if (start.y > end.y) neededDirections.push("^");
    if (start.x < end.x) neededDirections.push(">");
    if (start.x > end.x) neededDirections.push("<");
  }

  if (neededDirections.length <= 1) {
    return [neededDirections];
  } else if (forbiddenCheckFlag) {
    return [neededDirections];
  } else {
    return [neededDirections, [neededDirections[1], neededDirections[0]]];
  }
}

function generatePathString(path, start, end) {
  const xDelta = Math.abs(start.x - end.x);
  const yDelta = Math.abs(start.y - end.y);

  let pathString = "";
  for (const element of path) {
    if ("<>".includes(element)) {
      pathString += element.repeat(xDelta);
    } else {
      pathString += element.repeat(yDelta);
    }
  }
  pathString += "A";
  return pathString;
}

const pathlengthsIO = {};
const IOKeys = Object.keys(ioPositions);
for (let i = 0; i < IOKeys.length; i++) {
  for (let j = 0; j < IOKeys.length; j++) {
    if (i == j) {
      pathlengthsIO[`${IOKeys[i]}${IOKeys[j]}`] = 0;
    }

    const start = ioPositions[IOKeys[i]];
    const end = ioPositions[IOKeys[j]];
    const [p1, _] = computePathDirections(start, end, ioPositions);
    const pathString = generatePathString(p1, start, end);
    pathlengthsIO[`${IOKeys[i]}${IOKeys[j]}`] = pathString.length;
  }
}

const pathlengthsKeypad = {};
const keypadKeys = Object.keys(keypadPos);
for (let i = 0; i < keypadKeys.length; i++) {
  for (let j = 0; j < keypadKeys.length; j++) {
    if (i == j) {
      pathlengthsKeypad[`${keypadKeys[i]}${keypadKeys[j]}`] = 0;
    }

    const start = keypadPos[keypadKeys[i]];
    const end = keypadPos[keypadKeys[j]];
    const [p1, _] = computePathDirections(start, end, keypadPos);
    const pathString = generatePathString(p1, start, end);
    pathlengthsKeypad[`${keypadKeys[i]}${keypadKeys[j]}`] = pathString.length;
  }
}

function generateFirstSequence(oString, keypad) {
  let robotPosition = {
    x: keypad["A"].x,
    y: keypad["A"].y,
  };
  const neededPositions = [];
  for (const instruction of oString) {
    const { x, y } = keypad[`${instruction}`];
    neededPositions.push({ x, y });
  }

  let movementPossibilities = [];
  for (const position of neededPositions) {
    let instructionString = "";

    const [path1, path2] = computePathDirections(
      robotPosition,
      position,
      keypad
    );

    const currentPos = [];
    currentPos.push(generatePathString(path1, robotPosition, position));
    if (path2)
      currentPos.push(generatePathString(path2, robotPosition, position));
    movementPossibilities.push(currentPos);

    robotPosition = {
      x: position.x,
      y: position.y,
    };
  }

  return movementPossibilities;
}

function getFirstPermuations(seq) {
  let permutations = [[]];
  for (const element of seq) {
    if (element.length == 1) {
      permutations = permutations.map((p) => [...p, element[0]]);
    } else {
      const p1 = permutations.map((p) => [...p, element[0]]);
      const p2 = permutations.map((p) => [...p, element[1]]);
      permutations = [...p1, ...p2];
    }
  }

  return permutations.map((p) => p.join(""));
}

//n is the depth, where 0 is the first robot after human
let cache = {};
function cost(prev, next, n) {
  //console.log(prev, next, n);
  if (n == 0) {
    return pathlengthsKeypad[`${prev}${next}`];
  }
  if (cache[`${prev},${next},${n}`]) return cache[`${prev},${next},${n}`];
  const [path1, path2] = computePathDirections(
    keypadPos[prev],
    keypadPos[next],
    keypadPos
  );
  const pathStrings = [];
  pathStrings.push(generatePathString(path1, keypadPos[prev], keypadPos[next]));
  if (path2) {
    pathStrings.push(
      generatePathString(path2, keypadPos[prev], keypadPos[next])
    );
  }
  let min = Infinity;
  for (const path of pathStrings) {
    let pathStr = "A" + path; //we start from A
    let totalCost = 0;
    for (let i = 0; i < pathStr.length - 1; i++) {
      totalCost += cost(pathStr[i], pathStr[i + 1], n - 1);
    }
    min = Math.min(min, totalCost);
  }
  cache[`${prev},${next},${n}`] = min;
  return min;
}

let sum = 0;
for (const line of input) {
  const first = generateFirstSequence(line, ioPositions);

  const permutes = getFirstPermuations(first);
  let min = Infinity;
  for (const permute of permutes) {
    let costSum = 0;
    let checkStr = "A" + permute;
    for (let i = 0; i < checkStr.length - 1; i++) {
      costSum += cost(checkStr[i], checkStr[i + 1], 24);
    }
    min = Math.min(min, costSum);
  }

  const numerical = line.slice(0, line.length - 1);
  sum += parseInt(numerical) * min;
}
console.log(sum);
