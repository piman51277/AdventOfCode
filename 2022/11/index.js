const fs = require("fs");
const monkeysRaw = fs.readFileSync("input.txt", "utf8").split("\n\n");
const monkeys = [];
for (const monkey of monkeysRaw) {
  const [id, itemsRaw, testRaw, conditionRaw, trueCondRaw, falseCondRaw] =
    monkey.split("\n");
  const items = itemsRaw
    .replace("  Starting items: ", "")
    .split(", ")
    .map((i) => parseInt(i));
  let [test, k] = testRaw.replace("  Operation: new = old ", "").split(" ");
  if (k == "old") {
    test = "**";
    k = 1;
  }
  const divisor = parseInt(conditionRaw.replace("  Test: divisible by ", ""));
  const trueCond = parseInt(
    trueCondRaw.replace("    If true: throw to monkey ", "")
  );
  const falseCond = parseInt(
    falseCondRaw.replace("    If false: throw to monkey ", "")
  );

  monkeys.push({
    id,
    items,
    test,
    k,
    divisor,
    trueCond,
    falseCond,
  });
}

const inspectCounter = new Array(monkeys.length).fill(0);

function runRound() {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    const operation = monkey.test;
    for (let j = 0; j < monkey.items.length; j++) {
      inspectCounter[i]++;

      const worry = monkey.items[j];
      let worryLevel = worry;

      if (operation === "+") {
        worryLevel += parseInt(monkey.k);
      } else if (operation === "*") {
        worryLevel *= parseInt(monkey.k);
      } else if (operation === "**") {
        worryLevel = worryLevel * worryLevel;
      }

      worryLevel = Math.floor(worryLevel / 3);

      if (worryLevel % monkey.divisor === 0) {
        monkeys[monkey.trueCond].items.push(worryLevel);
      } else {
        monkeys[monkey.falseCond].items.push(worryLevel);
      }
    }

    //clear the items array
    monkey.items = [];
  }
}

for (let i = 0; i < 20; i++) {
  runRound();
}

const sorted = inspectCounter.sort((a, b) => b - a);

console.log(sorted[0] * sorted[1]);
