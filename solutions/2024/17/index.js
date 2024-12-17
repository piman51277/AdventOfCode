const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const registers = [0, 0, 0];

for (let i = 0; i < 3; i++) {
  let entry = Number(input[i].split(": ")[1]);
  registers[i] = entry;
}

const program = input[4].split(": ")[1].split(",").map(Number);

function safeMod(a, b) {
  return ((a % b) + b) % b;
}

function getComboOperand(index) {
  if (index >= 0 && index <= 3) {
    return index;
  } else if (index >= 4 && index <= 6) {
    return registers[index - 4];
  } else {
    return -1;
  }
}

let output = [];
for (let i = 0; i < program.length; i++) {
  let instruction = program[i];

  //console.log("before", i, instruction, registers);

  if (instruction == 0) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = Math.floor(num / Math.pow(2, combo));
    registers[0] = result;
  } else if (instruction == 1) {
    let num = registers[1];
    i++;
    let opand = program[i];
    let xor = num ^ opand;
    registers[1] = xor;
  } else if (instruction == 2) {
    i++;
    let combo = getComboOperand(program[i]);
    registers[1] = combo % 8;
  } else if (instruction == 3) {
    if (registers[0] == 0) {
      i++;
    } else {
      i++;
      let ptr = program[i];
      i = ptr - 1;
    }
  } else if (instruction == 4) {
    i++;
    registers[1] = registers[1] ^ registers[2];
  } else if (instruction == 5) {
    i++;
    let combo = getComboOperand(program[i]);
    console.log(combo % 8);
    output.push(safeMod(combo, 8));
  } else if (instruction == 6) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = Math.floor(num / Math.pow(2, combo));
    registers[1] = result;
  } else if (instruction == 7) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = Math.floor(num / Math.pow(2, combo));
    registers[2] = result;
  }

  //console.log("after", i, instruction, registers);
}

console.log(output.join(","));
