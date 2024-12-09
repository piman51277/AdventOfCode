const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim();

const blocks = [];
let free = [];
let fileptr = 0;
let posptr = 0;
for (let i = 0; i < input.length; i++) {
  if (i % 2 == 0) {
    blocks.push([posptr, fileptr, parseInt(input[i])]);
    fileptr++;
    posptr += parseInt(input[i]);
  } else {
    free.push([posptr, parseInt(input[i])]);
    posptr += parseInt(input[i]);
  }
}

//console.log(blocks);
//console.log(free);

for (let i = blocks.length - 1; i >= 0; i--) {
  let totaBreak = false;
  let foundFree = false;
  let doBreak = false;
  for (let j = 0; j < free.length; j++) {
    //if the free block cap s 0, slip
    if (free[j][1] == 0) continue;
    foundFree = true;

    //if we've already used this block, skip
    if (blocks[i][2] == 0) continue;

    //if the free block is before the block, skip
    if (free[j][0] > blocks[i][0]) continue;

    //insert as many of the block as possible
    const [filePos, filePtr, fileSize] = blocks[i];
    const [pos, cap] = free[j];
    //if the block can fully fit
    if (fileSize <= cap) {
      //create a new free block where we just removed the block
      free.push([filePos, fileSize]);

      free[j][1] -= fileSize;
      free[j][0] += fileSize;
      blocks[i][0] = pos;
      //blocks[i][2] -= Math.min(fileSize, cap);
      doBreak = true;
      //console.log(`Moving full block ${filePtr} to ${pos}`, blocks[i]);

      break;
    }
  }

  if (!foundFree) {
    console.log("No free block found for", blocks[i]);
    totaBreak = true;
    break;
  }

  //remove all non-free blocks
  free = free.filter((block) => block[1] > 0);

  //get the index of the last dat asegment
  let lastData = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i][2] + blocks[i][0] > lastData) {
      lastData = blocks[i][2] + blocks[i][0];
    }
  }

  //remove any frees that begin after the last data segment
  free = free.filter((block) => block[0] < lastData);

  //sort free blocks by starting position
  free.sort((a, b) => a[0] - b[0]);
}

//sort the blocks by starting position
blocks.sort((a, b) => a[0] - b[0]);

//sort the free blocks by starting position
free.sort((a, b) => a[0] - b[0]);

let everything = [];
for (let i = 0; i < blocks.length; i++) {
  const [pos, filePtr, size] = blocks[i];
  everything.push([pos, size, filePtr, "block"]);
}

for (let i = 0; i < free.length; i++) {
  const [pos, size] = free[i];
  if (size == 0) continue;
  everything.push([pos, size, 0, "free"]);
}

//sort everything by starting position
everything.sort((a, b) => a[0] - b[0]);

for (let i = 0; i < everything.length; i++) {
  //console.log(everything[i]);
}

//print out the blocks
let str = "";
let sum = 0;
let ptr = 0;
for (let i = 0; i < everything.length; i++) {
  const [pos, size, fileptr] = everything[i];

  for (let j = 0; j < size; j++) {
    sum += fileptr * (pos + j);
    str += fileptr;
    ptr++;
  }
}
console.log(sum);
