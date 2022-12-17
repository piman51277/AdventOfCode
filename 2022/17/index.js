const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const grid = new Array(10000).fill(0).map(() => new Array(7).fill(0));

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

for (let i = 0; i < 2022; i++) {
  tick();
}

//check how tall the grid is
let height = 0;
for (let i = grid.length - 1; i > 0; i--) {
  if (grid[i].includes(1)) {
    height = i;
    break;
  }
}

console.log(height + 1);
