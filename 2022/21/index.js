const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const monkeys = {};
for (const line of input) {
  const [name, op] = line.split(": ");

  //check what kind of op it is
  if (!isNaN(Number(op))) {
    //if it's a number, add it to the object
    monkeys[name] = {
      type: "constant",
      value: Number(op),
    };
  } else {
    //otherwise it's an expression
    const [a, oper, b] = op.split(" ");
    monkeys[name] = {
      type: "expression",
      a: a,
      op: oper,
      b: b,
      value: null,
    };
  }
}

function resolveNode(name) {

  const node = monkeys[name];
  if (node.value === null) {
    const aValue = resolveNode(node.a);
    const bValue = resolveNode(node.b);
    switch (node.op) {
      case "+":
        node.value = aValue + bValue;
        break;
      case "-":
        node.value = aValue - bValue;
        break;
      case "*":
        node.value = aValue * bValue;
        break;
      case "/":
        node.value = aValue / bValue;
        break;
    }
  }
  return node.value;
}

console.log(resolveNode("root"));
