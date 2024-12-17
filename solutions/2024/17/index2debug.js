const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const registers = [0, 0, 0];

for (let i = 0; i < 3; i++) {
  let entry = Number(input[i].split(": ")[1]);
  registers[i] = entry;
}

const program = input[4].split(": ")[1].split(",").map(Number);

function getComboOperand(index) {
  if (index >= 0 && index <= 3) {
    return index;
  } else if (index >= 4 && index <= 6) {
    return registers[index - 4];
  } else {
    return -1;
  }
}

function getComboString(index) {
  if (index >= 0 && index <= 3) {
    return `Literal ${index}`;
  } else if (index >= 4 && index <= 6) {
    return ["A", "B", "C"][index - 4];
  } else {
    return "X";
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
    console.log(`A = A / 2^${getComboString(program[i])}`);
    let result = Math.floor(num / Math.pow(2, combo));
    registers[0] = result;
  } else if (instruction == 1) {
    let num = registers[1];
    i++;
    let opand = program[i];
    let xor = num ^ opand;
    console.log(`B = B ^ ${opand}`);
    registers[1] = xor;
  } else if (instruction == 2) {
    i++;
    let combo = getComboOperand(program[i]);
    registers[1] = combo % 8;
    console.log(`B = ${getComboString(program[i])} % 8`);
  } else if (instruction == 3) {
    if (registers[0] == 0) {
      console.log("A == 0, skipping");
      i++;
    } else {
      i++;
      let ptr = program[i];
      i = ptr - 1;
      console.log(`A != 0, jumping to ${ptr}`);
    }
  } else if (instruction == 4) {
    i++;
    registers[1] = registers[1] ^ registers[2];
    console.log("B = B ^ C");
  } else if (instruction == 5) {
    i++;
    let combo = getComboOperand(program[i]);
    output.push(combo % 8);
    console.log(`Output: ${combo % 8} (${getComboString(program[i])})`);
  } else if (instruction == 6) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = Math.floor(num / Math.pow(2, combo));
    registers[1] = result;
    console.log(`B = A / 2^${getComboString(program[i])}`);
  } else if (instruction == 7) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = Math.floor(num / Math.pow(2, combo));
    registers[2] = result;
    //console.log(num, combo, result);
    console.log(`C = A / 2^${getComboString(program[i])}`);
  }

  //console.log("after", i, instruction, registers);
}

console.log(output.join(","));
