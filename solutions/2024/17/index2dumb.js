const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const registersRaw = [0, 0, 0];

for (let i = 0; i < 3; i++) {
  let entry = Number(input[i].split(": ")[1]);
  registersRaw[i] = entry;
}

const program = input[4].split(": ")[1].split(",").map(Number);

function test(n) {
  const registers = [...registersRaw];

  //set A to n
  registers[0] = n;

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
      output.push(combo % 8);
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
  }

  return output;
}

let tmp = 0;
while (true) {
  let result = test(tmp);

  //check if result same as program
  if (result.join(",") == program.join(",")) {
    console.log(tmp);
    break;
  }

  if (tmp % 1000 == 0) {
    console.log(tmp);
  }

  tmp++;
}
