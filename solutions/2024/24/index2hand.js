const fs = require("fs");
const [wiresRaw, gatesRaw] = fs
  .readFileSync("input.txt", "utf8")
  .trim()
  .split("\n\n")
  .map((n) => n.split("\n"));

const wires = {};
for (const line of wiresRaw) {
  const [name, value] = line.split(": ");
  wires[name] = parseInt(value);
}

//cgr -> z37
//hpc -> z31
//hwk -> z06
//qmd -> tnt

const swaps = {
  cgr: "z37",
  z37: "cgr",
  hpc: "z31",
  z31: "hpc",
  hwk: "z06",
  z06: "hwk",
  qmd: "tnt",
  tnt: "qmd",
};

const gates = [];
for (const line of gatesRaw) {
  let [inputs, output] = line.split(" -> ");

  if (swaps[output]) output = swaps[output];

  const [a, op, b] = inputs.split(" ");
  gates.push({ a, op, b, output });

  if (wires[a] == undefined) wires[a] = null;
  if (wires[b] == undefined) wires[b] = null;
  if (wires[output] == undefined) wires[output] = null;
}

//get all gates that use AND
const gate0ANDS = [];
const gate0XORS = [];
for (const gate of gates) {
  const { a, op, b, output } = gate;
  if (gate.op == "AND" && (a.indexOf("x") == 0 || b.indexOf("x") == 0)) {
    gate0ANDS.push(gate);
  }
  if (gate.op == "XOR" && (a.indexOf("x") == 0 || b.indexOf("x") == 0)) {
    gate0XORS.push(gate);
  }
}

//sorty both by a
gate0ANDS.sort((a, b) => a.a.localeCompare(b.a));
gate0XORS.sort((a, b) => a.a.localeCompare(b.a));

//get all XORS that don't hate direct x,y input
const gateSUMS = gates.filter(
  (gate) =>
    gate.op == "XOR" && !gate.a.startsWith("x") && !gate.b.startsWith("x")
);

//get all ANDS that don't have direct x,y input
const gateHA2 = gates.filter(
  (gate) =>
    gate.op == "AND" && !gate.a.startsWith("x") && !gate.b.startsWith("x")
);

//get all OR gates
const gateOR = gates.filter((gate) => gate.op == "OR");

//get all the outputs of gate0NDS
const gate0XORSoutputs = gate0XORS.map((gate) => gate.output);

const qe = Object.keys(swaps);
qe.sort((a, b) => a.localeCompare(b));
console.log(qe.join(","));

//z45

//qmd WRONG

//nbs
//tnt
