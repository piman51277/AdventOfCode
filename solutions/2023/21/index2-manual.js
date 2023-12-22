const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const grid = input.map((line) => line.split(""));

//get the location of the S
const start = grid.reduce((acc, row, i) => {
  if (row.includes("S")) {
    acc = [i, row.indexOf("S")];
  }
  return acc;
});

const startX = start[0];

const gridSide = grid.length;

const desiredSteps = 26501365;

//basically, we want every point an odd taxicab awai frm the statt


//its 7450 per complete tile (odd)
//and 6501 per incomplete tile (even)

//tiles are 131x131

//this is how many complete tiles are from the edge of the start tile to to the very edge
const acrossArm = Math.floor((desiredSteps - startX) / gridSide) - 1;
const diag = acrossArm * 2 + 1

//console.log("acrossArm, diag");
//console.log(acrossArm, diag);

//compute the inner core

//first is a algebraic sequence 8, 16, 24, 32, 40, 48, 56, 64, 72,... 
//second is 4, 12, 20, 28, 36, 44, 52, 60, 68, 76, ... , 
//both are delta 8

const firstTerms = ((acrossArm + 1) / 2) - 1;
const secondTerms = firstTerms + 1
//console.log("firstTerms, secondTerms");
//console.log(firstTerms, secondTerms);

let firstSum = firstTerms * (16 + (8 * (firstTerms - 1))) / 2;
const secondSum = secondTerms * (8 + (8 * (secondTerms - 1))) / 2;

//the first sum need to include the initial block
firstSum++;


//console.log("firstSum, secondSum");
//console.log(firstSum, secondSum);


let insideTilesFirst = firstSum * 7421;
let insideTilesSecond = secondSum * 7450;

let insideTiles = insideTilesFirst + insideTilesSecond;
//console.log("insideTiles");
//console.log(insideTiles);

const slantCount = acrossArm

//console.log("edgeCount");
//console.log(slantCount);

const NESlant = 6512 * slantCount;
const SWSlant = 6512 * slantCount;
const SESlant = 6514 * slantCount;
const NWSlant = 6501 * slantCount;

const slantSum = NESlant + SWSlant + SESlant + NWSlant;

//console.log("slantSum");
//console.log(slantSum);


//NE slants -> 954
//North corner 5592
//NW slants -> 948

//SW slant -> 947
//S corner -> 5605
//SE slant -> 959

//W corner 5594
//E corner 5603

const cornerSum = 5592 + 5605 + 5594 + 5603;

//console.log("cornerSum");
//console.log(cornerSum);


const sECount = slantCount + 1;

//console.log("sECount");
//console.log(sECount);

//SE -> 954 954 948 947

const sESum = sECount * (954 + 947 + 948 + 959);

//console.log("sESum");
//console.log(sESum);
console.log("insideTiles", insideTiles);
console.log("slantSum", slantSum);
console.log("cornerSum", cornerSum);
console.log("sESum", sESum);


const total = insideTiles + slantSum + cornerSum + sESum

//console.log("total");
console.log(total);