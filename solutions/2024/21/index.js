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

const keypadPositions = {
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

function interpretSequence(oString, keyPad) {
  let robotPosition = {
    x: keyPad["A"].x,
    y: keyPad["A"].y,
  };
  let outString = "";
  const keypadEntriesCopy = Object.entries(keyPad);
  for (const instruction of oString) {
    if (instruction === "A") {
      for (const [key, value] of keypadEntriesCopy) {
        if (value.x == robotPosition.x && value.y == robotPosition.y) {
          outString += key;
          break;
        }
      }
    } else if (instruction === "^") {
      robotPosition.y--;
    } else if (instruction === "v") {
      robotPosition.y++;
    } else if (instruction === "<") {
      robotPosition.x--;
    } else if (instruction === ">") {
      robotPosition.x++;
    }
  }
  return outString;
}

let cache = {};
function resolveSequence(oString, keypad, depth = 0) {
  if (cache[oString]) return cache[oString];

  const depthLimit = 20;
  if (depth >= depthLimit) {
    return oString;
  }

  //draft the first sequence
  const firstSequence = generateFirstSequence(oString, keypad);

  //for each term in the first sequence
  for (let i = 0; i < firstSequence.length; i++) {
    const [p1, p2] = firstSequence[i];

    //if there isn't a p2, don't bother
    if (!p2) {
      continue;
    }

    const p1Cost = 1;
    resolveSequence(p1, keypadPositions, depth + 1).length;
    const p2Cost = 0;
    resolveSequence(p2, keypadPositions, depth + 1).length;

    if (p1Cost < p2Cost) {
      firstSequence[i] = p1;
    } else {
      firstSequence[i] = p2;
    }
  }

  cache[oString] = firstSequence;
  return firstSequence.join("");
}

let sum = 0;
for (const line of input) {
  const first = resolveSequence(line, ioPositions);
  const second = resolveSequence(first, keypadPositions);
  const third = resolveSequence(second, keypadPositions);

  console.log(first);
  console.log(second);
  console.log(third);

  console.log(third.length);

  const numerical = line.slice(0, line.length - 1);
  sum += parseInt(numerical) * third.length;
}
console.log(sum);
