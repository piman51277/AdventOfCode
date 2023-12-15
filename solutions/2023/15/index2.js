const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

function getHash(str) {
  let val = 0;
  for (let i = 0; i < str.length; i++) {
    let cod = str.charCodeAt(i);
    val += cod;
    val *= 17;
    val = val % 256;
  }
  return val;
}
const boxes = {}
//create boxs from 0 - 255
for (let i = 0; i < 256; i++) {
  boxes[i] = [];
}

const instuctions = input[0].split(",")
for (let i = 0; i < instuctions.length; i++) {
  //extract all beginning chars from instuctions[i] that are not numbers
  let str = instuctions[i].match(/^[a-z]+/)[0]
  let box = getHash(str)
  let isOpDas = instuctions[i].includes("-")

  if (isOpDas) {
    //remove the lens with this str from the box
    let index = boxes[box].map(n => n[0]).indexOf(str)
    if (index !== -1) {
      boxes[box].splice(index, 1)
    }
  } else {
    //get the number
    let num = parseInt(instuctions[i].split("=")[1])

    //is there already a lens with the same label
    let index = boxes[box].map(n => n[0]).indexOf(str)
    if (index !== -1) {
      boxes[box][index] = [str, num]
    }
    else {
      boxes[box].push([str, num])
    }
  }
}

let power = 0;
for (let i = 0; i < 256; i++) {
  let box = boxes[i]
  for (let j = 0; j < box.length; j++) {
    power += box[j][1] * (i + 1) * (j + 1)
  }
}
console.log(power)