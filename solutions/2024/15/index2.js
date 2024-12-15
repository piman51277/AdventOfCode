const fs = require("fs");
let [gridRaw, movements] = fs
  .readFileSync("input.txt", "utf8")
  .trim()
  .split("\n\n");

movements = movements.replace(/\n/g, "").split("");

/**
 * Class for a 2D Bound
 * @param {number} x - x coordinate of the top left corner
 * @param {number} y - y coordinate of the top left corner
 * @param {number} width - width of the box
 * @param {number} height - height of the box
 */
class Bound2D {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width || 0;
    this.height = height || 0;
  }

  /**
   * Checks if this bound collides with another bound (strong overlap)
   * @param {Bound2D} bound
   * @returns
   */
  doesCollide(bound) {
    return (
      this.x < bound.x + bound.width &&
      this.x + this.width > bound.x &&
      this.y < bound.y + bound.height &&
      this.y + this.height > bound.y
    );
  }

  /**
   * Checks if this bound collides with another bound (weak overlap)
   * @param {Bound2D} bound
   * @returns
   */
  doesCollideWeak(bound) {
    return (
      this.x <= bound.x + bound.width &&
      this.x + this.width >= bound.x &&
      this.y <= bound.y + bound.height &&
      this.y + this.height >= bound.y
    );
  }
}

let grid = gridRaw.split("\n").map((row) => row.split(""));
let playerPos = { x: 0, y: 0 };

//look for the @
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === "@") {
      playerPos = { x: j * 2, y: i, bound: new Bound2D(j, i, 1, 1) };
      break;
    }
  }
}

let boxes = [];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "O") {
      boxes.push({
        x: x * 2,
        y,
        bound: new Bound2D(x * 2, y, 2, 1),
        id: boxes.length,
      });
    }
  }
}

let walls = [];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "#") {
      walls.push({ x: x * 2, y, bound: new Bound2D(x * 2, y, 2, 1) });
    }
  }
}
//widthxheiht

//walls are 1x1
//boxes are 2x1
//player is 1x1

const directions = {
  "^": { x: 0, y: -1 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
  ">": { x: 1, y: 0 },
};

function print() {
  //create an double wide grid
  let doubleWideGrid = Array.from({ length: grid.length }, () =>
    Array(grid[0].length * 2).fill(".")
  );

  //walls
  for (const wall of walls) {
    doubleWideGrid[wall.y][wall.x] = "#";
    doubleWideGrid[wall.y][wall.x + 1] = "#";
  }

  //boxes
  for (const box of boxes) {
    doubleWideGrid[box.y][box.x] = "O";
    doubleWideGrid[box.y][box.x + 1] = "O";
  }

  //player
  doubleWideGrid[playerPos.y][playerPos.x] = "@";

  console.log(doubleWideGrid.map((row) => row.join("")).join("\n"));
}

//print();

for (const mov of movements) {
  const newPosition = {
    x: playerPos.x + directions[mov].x,
    y: playerPos.y + directions[mov].y,
    bound: new Bound2D(
      playerPos.x + directions[mov].x,
      playerPos.y + directions[mov].y,
      1,
      1
    ),
  };

  //look for walls that collide
  let doesWallsCollide = false;
  for (const wall of walls) {
    if (wall.bound.doesCollide(newPosition.bound)) {
      doesWallsCollide = true;
      break;
    }
  }

  if (doesWallsCollide) {
    //console.log("wall collision");
    continue;
  }

  //look for boxes that collide
  let collidedBox = null;
  for (const box of boxes) {
    //console.log(box.bound, newPosition.bound);

    if (box.bound.doesCollide(newPosition.bound)) {
      collidedBox = box;
      break;
    }
  }

  let drafts = [];
  let finalized = [];

  let moveOK = true;

  //if there isn't a box, just move and continue
  if (!collidedBox) {
    playerPos = newPosition;
    //console.log("player moved");
    continue;
  }

  //if there is a box add to the draft
  drafts.push({
    x: collidedBox.x + directions[mov].x,
    y: collidedBox.y + directions[mov].y,
    bound: new Bound2D(
      collidedBox.x + directions[mov].x,
      collidedBox.y + directions[mov].y,
      2,
      1
    ),
    id: collidedBox.id,
  });

  while (drafts.length > 0) {
    const draft = drafts.shift();

    //check if we collide into any wall
    let doesCollideWall = false;
    for (const wall of walls) {
      if (wall.bound.doesCollide(draft.bound)) {
        doesCollideWall = true;
        break;
      }
    }
    if (doesCollideWall) {
      moveOK = false;
      break;
    }

    //check if we collide into any box
    let collidingBoxes = [];
    for (const box of boxes) {
      if (box.bound.doesCollide(draft.bound) && box.id !== draft.id) {
        collidingBoxes.push(box);
      }
    }

    //if we collide into a box, add it to the drafts
    for (const box of collidingBoxes) {
      drafts.push({
        x: box.x + directions[mov].x,
        y: box.y + directions[mov].y,
        bound: new Bound2D(
          box.x + directions[mov].x,
          box.y + directions[mov].y,
          2,
          1
        ),
        id: box.id,
      });
    }

    //finalize the move
    finalized.push(draft);
  }

  if (moveOK) {
    playerPos = newPosition;
    for (const final of finalized) {
      boxes[final.id] = final;
    }
  }

  //print();
}

let score = 0;
for (const box of boxes) {
  //console.log(box.bound);
  score += box.bound.y * 100 + box.bound.x;
}

console.log(score);
