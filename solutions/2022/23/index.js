const fs = require("fs");
const { setPriority } = require("os");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const width = input[0].length + 40;
const height = input.length + 40;
const map = new Array(height).fill(0).map(() => new Array(width).fill(0));

const elves = [];
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (input[y][x] === "#") {
      map[y + 20][x + 20] = 1;
      elves.push({ x: x + 20, y: y + 20 });
    }
  }
}

const checkOrder = ["north", "south", "west", "east"];

function runRound() {
  //first half of the process.. proposals
  const proposals = [];
  for (let g = 0; g < elves.length; g++) {
    const elf = elves[g];
    //get the positon of the elf
    const { x, y } = elf;

    //check the 8 adjacent tiles
    const NTile = map[y - 1][x] == 1;
    const STile = map[y + 1][x] == 1;
    const WTile = map[y][x - 1] == 1;
    const ETile = map[y][x + 1] == 1;
    const NWTile = map[y - 1][x - 1] == 1;
    const NETile = map[y - 1][x + 1] == 1;
    const SWTile = map[y + 1][x - 1] == 1;
    const SETile = map[y + 1][x + 1] == 1;

    //if all of them are false, then the elf is alone
    if (
      !NTile &&
      !STile &&
      !WTile &&
      !ETile &&
      !NWTile &&
      !NETile &&
      !SWTile &&
      !SETile
    ) {
      proposals.push({ x, y, label: "nomove" });
      continue;
    }

    for (const check of checkOrder) {
      if (check == "north" && !NTile && !NWTile && !NETile) {
        proposals.push({ x, y: y - 1, label: "north" });
        break;
      }
      if (check == "south" && !STile && !SWTile && !SETile) {
        proposals.push({ x, y: y + 1, label: "south" });
        break;
      }
      if (check == "west" && !WTile && !NWTile && !SWTile) {
        proposals.push({ x: x - 1, y, label: "west" });
        break;
      }
      if (check == "east" && !ETile && !NETile && !SETile) {
        proposals.push({ x: x + 1, y, label: "east" });
        break;
      }
    }

    //if no proposal was made, then the elf cannot move
    if (proposals.length == g) proposals.push({ x, y, label: "nomove" });
  }

  //process all the proposals
  for (let i = 0; i < proposals.length; i++) {
    //if proposal is blank, do nothing
    if (proposals[i].label == "nomove") continue;

    //check if any other proposal is at the same position
    const { x, y } = proposals[i];
    let found = false;
    for (let j = 0; j < proposals.length; j++) {
      if (i == j) continue;
      if (proposals[j].x == x && proposals[j].y == y) {
        found = true;
        break;
      }
    }

    //if no other proposal is at the same position, then move the elf
    if (!found) {
      map[y][x] = 1;
      map[elves[i].y][elves[i].x] = 0;
      elves[i].x = x;
      elves[i].y = y;
    }
  }

  checkOrder.push(checkOrder.shift());
}

function printMap() {
  for (let y = 0; y < map.length; y++) {
    let str = "";
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == 1) str += "#";
      else if (map[y][x] == 2) str += "A";
      else str += ".";
    }
    console.log(str);
  }
}

for (let rounds = 0; rounds <= 10; rounds++) {
  runRound();
}

let minX = 100000;
let maxX = 0;
let minY = 100000;
let maxY = 0;

for (const elf of elves) {
  if (elf.x < minX) minX = elf.x;
  if (elf.x > maxX) maxX = elf.x;
  if (elf.y < minY) minY = elf.y;
  if (elf.y > maxY) maxY = elf.y;
}

let empty = 0;
//count the number of empty tiles in that space
for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; x++) {
    if (map[y][x] == 0) empty++;
  }
}

console.log(empty);
