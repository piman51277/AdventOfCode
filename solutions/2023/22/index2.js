const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const bricks = []

let ind = 0;
for (const line of input) {
  const [startCords, endCords] = line.split("~");
  const [startX, startY, startZ] = startCords.split(",");
  const [endX, endY, endZ] = endCords.split(",");

  //figure out the x-y profile of the brick
  let profile = [];

  //if the z values are different, then the brick is vertical
  if (startZ !== endZ) {
    profile.push(`${startX},${startY}`);
  }

  else {
    //we have to iterate across the x and y values to figure out the profile
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        profile.push(`${x},${y}`);
      }
    }
  }

  let minZ = Math.min(startZ, endZ);
  let maxZ = Math.max(startZ, endZ);


  bricks.push({ index: ind, currentZ: minZ, currentZMax: maxZ, supportedBy: [], supporting: [], profile })
  ind++;
}


//sort bricks by min Z, lowest to highest
bricks.sort((a, b) => a.currentZ - b.currentZ);

const toSettle = bricks;
const settled = []

//while there are still bricks to settle
while (toSettle.length > 0) {

  let hasSettled = false;

  outerloop:
  for (const brick of toSettle) {
    //first check if the brick is on the ground
    if (brick.currentZ === 1) {
      settled.push(brick);
      toSettle.splice(toSettle.indexOf(brick), 1);
      hasSettled = true;
      break;
    }

    //if not, check if it is supported by any settled bricks
    for (const settledBrick of settled) {
      //is this brick at 1 minus the settled brick's currentZ?
      if (brick.currentZ != settledBrick.currentZMax + 1) continue;

      //if so, check if the brick is supported by the settled brick
      if (brick.profile.some(cord => settledBrick.profile.includes(cord))) {
        //if so, add the settled brick to the brick's supportedBy array
        brick.supportedBy.push(settledBrick.index);

        //add the brick to the settled brick's supporting array
        settledBrick.supporting.push(brick.index);

        //this new brick is now settled
        settled.push(brick);
        toSettle.splice(toSettle.indexOf(brick), 1);
        hasSettled = true;

        //break out of the outer loop
        break outerloop;
      }
    }
  }

  //if no bricks have settled, then lower all the bricks by 1
  if (!hasSettled) {
    for (const brick of toSettle) {
      brick.currentZ--;
      brick.currentZMax--;
    }
  }
}


//recompute supporting 
for (const brick of settled) {
  const currentID = brick.index;

  //check every other block is it is supporting this one
  for (const otherBrick of settled) {
    if (otherBrick.index === currentID) continue;

    //is the other brick 1 below this one?
    if (brick.currentZ != otherBrick.currentZMax + 1) continue;

    //if so, check if the brick is supported by the settled brick
    if (brick.profile.some(cord => otherBrick.profile.includes(cord))) {

      //double check, have we already added this brick?
      if (brick.supportedBy.includes(otherBrick.index)) continue;

      //if so, add the settled brick to the brick's supportedBy array
      brick.supportedBy.push(otherBrick.index);

      //add the brick to the settled brick's supporting array
      otherBrick.supporting.push(brick.index);
    }

  }
}

let notfreestanding = []
for (const brick of settled) {
  //get the list of bricks that it supports
  const supported = brick.supporting;

  //console.log(`Brick ${brick.index} supports ${supported}`)

  //does every brick it supports have more than 1 brick supporting it?
  let canyes = true
  for (const brickID of supported) {
    const brickS = settled.find(b => b.index === brickID)
    if (brickS.supportedBy.length === 1) {
      canyes = false;
      //console.log("Invalidated by brick " + brickS.index, brickS.supportedBy);
      break;
    }
  }

  if (!canyes) {
    notfreestanding.push(brick);
  }
}


let chainSum = 0;
for (const brick of notfreestanding) {
  let destroyed = new Set();
  destroyed.add(brick.index);

  let checked = new Set();
  let queue = [...brick.supporting];

  while (queue.length > 0) {
    const current = queue.shift();

    const brickS = settled.find(b => b.index === current)

    let supports = [...brickS.supportedBy];

    //if we've already destroyed this brick, skip it
    if (destroyed.has(brickS.index)) continue;

    //look through all the supports and remove ones we've already destroyed
    for (let i = 0; i < supports.length; i++) {
      if (destroyed.has(supports[i])) {
        supports.splice(i, 1);
        i--;
      }
    }

    if (supports.length == 0) {
      //this will collapse
      destroyed.add(brickS.index);

      //add the bricks this one supports to the queue
      queue.push(...brickS.supporting);
    }
  }



  if (destroyed.size > 1) {
    chainSum += destroyed.size - 1;
  }
}

console.log(chainSum);
