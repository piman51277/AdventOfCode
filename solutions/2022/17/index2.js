const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

let grid = new Array(100000).fill(0).map(() => new Array(7).fill(0));

const pieces = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

let activePiece = 0;
let currentJetIndex = 0;
function tick() {
  //spawn the new piece
  const piece = pieces[activePiece];

  //get the dimensions of the piece
  const pieceSize = [piece.length, piece[0].length];

  //find the topmost row of the piece
  let top = 0;
  for (let i = grid.length - 1; i > 0; i--) {
    if (grid[i].includes(1)) {
      top = i;
      break;
    }
  }

  //if the botom is empty
  if (!grid[0].includes(1)) {
    top = -1;
  }

  let px = 0;
  let py = 0;

  //place the piece 2units from the left
  //and 3 units from the top of the topmost row
  px = 2;
  py = top + 4;

  let toPushJet = true;
  while (true) {
    //if we are set to be pushed by a jet
    if (toPushJet) {
      //get the jet
      const jet = input[currentJetIndex % input.length];
      if (jet === "<") {
        //if the piece can move left
        if (px > 0) {
          px--;
        }
      } else {
        //if the piece can move right
        if (px + pieceSize[1] < grid[0].length) {
          px++;
        }
      }
      currentJetIndex++;

      //if there is a collision
      let collision = false;

      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (
            piece[y][x] &&
            (grid[y + py] === undefined || grid[y + py][x + px] === 1)
          ) {
            collision = true;
          }
        }
      }

      //console.log(jet, collision);

      if (collision) {
        //reverse the jet
        if (jet === "<") {
          px++;
        }
        if (jet === ">") {
          px--;
        }
      }
    } else {
      let collision = false;

      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (
            piece[y][x] &&
            (grid[y + py - 1] === undefined || grid[y + py - 1][x + px] === 1)
          ) {
            collision = true;
          }
        }
      }

      //console.log("falling", collision);
      if (collision) break;
      py--;
    }

    //displayGrid(activePiece, px, py);
    toPushJet = !toPushJet;
  }

  //place the piece on the grid
  for (let i = 0; i < pieceSize[0]; i++) {
    for (let j = 0; j < pieceSize[1]; j++) {
      if (piece[i][j] == 1) grid[py + i][px + j] = 1;
    }
  }

  //displayGrid(activePiece, px, py);

  activePiece = (activePiece + 1) % pieces.length;
}

const sections = [];

for (let i = 0; i < 4000; i++) {
  tick();

  sections.push([activePiece % 5, currentJetIndex % input.length]);
}

//sections is in this form
//<preamble> <repeater> <repeater> <repeater> <ending>
//we need to find the repeating section

//find the repeating section
let repeatingSectionBegin = 0;
let repeatingSectionEnd = 0;

//offset to account for the preamble
for (let offset = 0; offset < sections.length; offset++) {
  //find the first occurence of the repeating section
  const firstElement = sections[offset];

  //find the next occurence of the first element
  for (let i = offset + 1; i < sections.length; i++) {
    if (
      sections[i][0] === firstElement[0] &&
      sections[i][1] === firstElement[1]
    ) {
      //begin checking next elements until we find a mismatch
      let j = i + 1;
      let k = offset + 1;
      let success = true;
      while (j < sections.length && k < i + 1) {
        if (
          sections[j][0] !== sections[k][0] ||
          sections[j][1] !== sections[k][1]
        ) {
          success = false;
          break;
        }
        j++;
        k++;
      }

      if (success) {
        repeatingSectionBegin = offset;
        repeatingSectionEnd = k - 1;
      }

      break;
    }
  }

  if (repeatingSectionBegin !== 0) break;
}
const repeatingSectionLength = repeatingSectionEnd - repeatingSectionBegin;

function getHeightAtTick(tickL) {
  grid = new Array(100000).fill(0).map(() => new Array(7).fill(0));
  activePiece = 0;
  currentJetIndex = 0;

  for (let i = 0; i < tickL; i++) {
    tick();
  }

  let height = 0;
  for (let i = grid.length - 1; i > 0; i--) {
    if (grid[i].includes(1)) {
      height = i;
      break;
    }
  }

  return height + 1;
}

const beforeBlock = getHeightAtTick(repeatingSectionBegin + 1);
const afterBlock = getHeightAtTick(repeatingSectionEnd + 1);
const heightperBlock = afterBlock - beforeBlock;

const testint = 1000000000000;

const totalBlocks = Math.floor(
  (testint - repeatingSectionBegin) / repeatingSectionLength
);

const remainder = (testint - repeatingSectionBegin) % repeatingSectionLength;
const ending = getHeightAtTick(repeatingSectionEnd + remainder) - afterBlock;

console.log(totalBlocks * heightperBlock + beforeBlock + ending);
