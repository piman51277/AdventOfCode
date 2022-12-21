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

function resolveNode(name, reset = false) {
  const node = monkeys[name];
  if ((node.value === null || reset) && node.type === "expression") {
    const aValue = resolveNode(node.a, reset);
    const bValue = resolveNode(node.b, reset);
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

function searchTreeForHuman(begin) {
  const queue = [begin];
  while (queue.length > 0) {
    const current = queue.shift();
    const node = monkeys[current];
    if (node.type === "expression") {
      if (node.a === "humn" || node.b === "humn") {
        return true;
      } else {
        queue.push(node.a);
        queue.push(node.b);
      }
    }
  }
  return false;
}

//figure out which side of the tree human is on
const rootLeft = monkeys.root.a;
const rootRight = monkeys.root.b;

const isLeft = searchTreeForHuman(rootLeft);

const neededValueNode = isLeft ? rootRight : rootLeft;
const currentValueNode = isLeft ? rootLeft : rootRight;

let last = resolveNode(currentValueNode);
let differenceTotal = 0;
for (let i = 0; i < 5000; i++) {
  monkeys.humn.value++;
  const nowValue = resolveNode(currentValueNode, true);
  differenceTotal += nowValue - last;
  last = nowValue;
}
const avg = differenceTotal / 5000;
//reset the human value
monkeys.humn.value -= 5000;

//figure out how many times we need to add or subtract to get to the needed value

//3 iterations
const delta =
  resolveNode(neededValueNode) - resolveNode(currentValueNode, true);
const humanDelta = delta / avg;

monkeys.humn.value = Math.floor(humanDelta + monkeys.humn.value);

let currentDelta =
  resolveNode(neededValueNode) - resolveNode(currentValueNode, true);
//start fine-tuning the human value
let tuningFactor = 1;
while (currentDelta !== 0) {
  //decide if we need to add or subtract

  //if the delta is positive, we need to add value to current
  if (currentDelta > 0) {
    const negation = avg < 0 ? -1 : 1;

    const steps = Math.floor(Math.max(tuningFactor * 10000, 1) * negation);
    monkeys.humn.value += steps;
    currentDelta =
      resolveNode(neededValueNode) - resolveNode(currentValueNode, true);
  }
  //if the delta is negative, we need to subtract value from current
  else if (currentDelta < 0) {
    const negation = avg < 0 ? 1 : -1;

    const steps = Math.floor(Math.max(tuningFactor * 10000, 1) * negation);
    monkeys.humn.value += steps;
    currentDelta =
      resolveNode(neededValueNode) - resolveNode(currentValueNode, true);
  }

  //decrease the tuning factor
  tuningFactor *= 0.9;
}

console.log(monkeys.humn.value);
