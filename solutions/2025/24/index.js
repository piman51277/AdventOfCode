const fs = require("fs");
const [wiresRaw, gatesRaw] = fs
  .readFileSync("input.txt", "utf8")
  .split("\n\n")
  .map((n) => n.split("\n"));

const wires = {};
for (const line of wiresRaw) {
  const [name, value] = line.split(": ");
  wires[name] = parseInt(value);
}

const gates = [];
for (const line of gatesRaw) {
  const [inputs, output] = line.split(" -> ");
  const [a, op, b] = inputs.split(" ");
  gates.push({ a, op, b, output });

  if (wires[a] == undefined) wires[a] = null;
  if (wires[b] == undefined) wires[b] = null;
  if (wires[output] == undefined) wires[output] = null;
}

while (true) {
  for (let i = 0; i < gates.length; i++) {
    const { a, op, b, output } = gates[i];

    if (wires[a] === null || wires[b] === null) continue;

    let outputVal;
    if (op == "AND") {
      outputVal = wires[a] & wires[b];
    } else if (op == "OR") {
      outputVal = wires[a] | wires[b];
    } else if (op == "XOR") {
      outputVal = wires[a] ^ wires[b];
    }

    wires[output] = outputVal;
  }

  //are all the wires starting with z non null?
  let ok = false;
  for (const key in wires) {
    if (key.startsWith("z") && wires[key] === null) {
      ok = true;
      break;
    }
  }

  if (!ok) break;
}

const values = [];

//extract the values of the wires starting with z
for (const key in wires) {
  if (key.startsWith("z")) values.push([key, wires[key]]);
}

values.sort((a, b) => b[0].localeCompare(a[0]));

//convert to binary
const vals = values.map((n) => n[1].toString(2));

//interpret as int
console.log(vals.join());
console.log(parseInt(vals.join(""), 2));
