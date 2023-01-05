const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const crates = input.slice(0, 8);
const rowCount = (crates[0].length - 3) / 4 + 1;

let ke = [];
for (const line of crates) {
  let crates = [];
  for (let i = 0; i < rowCount; i++) {
    const string = line.slice(4 * i, 4 * i + 3);
    if (string === "   ") {
      crates.push(0);
    } else {
      crates.push(string[1]);
    }
  }
  ke.push(crates);
}

const columns = [];

for (const row of ke) {
  for (let i = 0; i < row.length; i++) {
    if (row[i] !== 0) {
      columns[i] = columns[i] || [];
      columns[i].push(row[i]);
    }
  }
}

const instructions = input.slice(10).map((line) => line.split(" "));

for (const instruction of instructions) {
  const amount = parseInt(instruction[1]);
  const from = parseInt(instruction[3]) - 1;
  const to = parseInt(instruction[5]) - 1;

  //pop out the first amount of entries from the from column
  const popped = columns[from].splice(0, amount);

  //add the popped entries to the start of the to column,
  columns[to].unshift(...popped);
}

//read out the first entry of each column
const result = columns.map((column) => column[0]).join("");
console.log(result);
