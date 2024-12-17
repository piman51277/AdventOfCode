const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").split("\n");
const registers = [0n, 0n, 0n];

for (let i = 0; i < 3; i++) {
  let entry = BigInt(input[i].split(": ")[1]);
  registers[i] = entry;
}

const program = input[4]
  .split(": ")[1]
  .split(",")
  .map((x) => BigInt(x));

function getComboOperand(index) {
  if (index >= 0n && index <= 3n) {
    return index;
  } else if (index >= 4n && index <= 6n) {
    return registers[Number(index - 4n)];
  } else {
    return -1n;
  }
}

let output = [];
for (let i = 0; i < program.length; i++) {
  let instruction = program[i];

  if (instruction == 0n) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = num >> combo;

    console.log("A = ???", result, num, combo);
    registers[0] = result;
  } else if (instruction == 1n) {
    let num = registers[1];
    i++;
    let opand = program[i];
    let xor = num ^ opand;
    registers[1] = xor;
  } else if (instruction == 2n) {
    i++;
    let combo = getComboOperand(program[i]);
    registers[1] = combo % 8n;
  } else if (instruction == 3n) {
    if (registers[0] == 0n) {
      i++;
    } else {
      i++;
      let ptr = program[i];
      i = Number(ptr - 1n);
    }
  } else if (instruction == 4n) {
    i++;
    registers[1] = registers[1] ^ registers[2];
  } else if (instruction == 5n) {
    i++;
    let combo = getComboOperand(program[i]);
    console.log(Number(combo % 8n));
    output.push(Number(combo % 8n));
  } else if (instruction == 6n) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = num >> combo;
    registers[1] = result;
  } else if (instruction == 7n) {
    let num = registers[0];
    i++;
    let combo = getComboOperand(program[i]);
    let result = num >> combo;

    console.log("C = ???", result, num, combo, program[i]);
    registers[2] = result;
  }
}

console.log(output.join(","));
