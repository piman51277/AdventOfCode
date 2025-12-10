const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();
const { init } = require("z3-solver");

const regex = /\[(.+)\](.+)/;
const inparen = /\((.+)\)/;

const entries = [];

for (const line of input) {
  const match = regex.exec(line);
  const first = match[1];
  let second = match[2].split(" ");
  let end = second.pop();

  second = second.map((word) => {
    const parenMatch = inparen.exec(word);
    if (parenMatch) {
      return parenMatch[1].split(",").map(Number);
    } else {
      return word;
    }
  });
  second.shift();

  end = end.replace("}", "").replace("{", "").split(",").map(Number);

  entries.push({
    indicators: first,
    buttons: second,
    joltage: end,
    numLights: first.length,
  });
}

async function main() {
  const {
    Context,
  } = await init();

  const toSolve = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  let presses = 0;
  for (const { buttons, joltage, numLights } of entries) {
    const { Solver, Int, Optimize } = new Context("main");
    const solver = new Optimize();
    let sums = new Array(numLights);

    for (let i = 0; i < numLights; i++) {
      sums[i] = Int.val(0);
    }

    for (let i = 0; i < buttons.length; i++) {
      //button press variable
      const pressVar = Int.const(toSolve[i]);

      //these must be positive
      solver.add(pressVar.ge(0));

      for (let j = 0; j < numLights; j++) {
        //if button is pressed, add pressVar to sums at indices
        if (buttons[i].includes(j)) {
          sums[j] = sums[j].add(pressVar);
        }
      }
    }

    //set sums = target
    for (let i = 0; i < numLights; i++) {
      solver.add(sums[i].eq(joltage[i]));
    }

    //minimize total presses
    const totalPresses = Int.const("totalPresses");
    let totalSum = Int.val(0);
    for (let i = 0; i < buttons.length; i++) {
      const pressVar = Int.const(toSolve[i]);
      totalSum = totalSum.add(pressVar);
    }
    solver.add(totalPresses.eq(totalSum));
    solver.minimize(totalPresses);
    const result = await solver.check();
    if (result === "sat") {
      const model = solver.model();
      let totalPresses = 0;
      for (let i = 0; i < buttons.length; i++) {
        const pressVar = Int.const(toSolve[i]);
        const val = model.get(pressVar);
        totalPresses += parseInt(val);
      }
      presses += totalPresses;
    }
  }

  console.log(presses);
}
main();
