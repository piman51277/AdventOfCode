const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

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
    unk: end,
    numLights: first.length,
  });
}

function applyButton(state, button) {
  let newState = state.split("");
  for (const index of button) {
    newState[index] = newState[index] === "." ? "#" : ".";
  }
  return newState.join("");
}

let presses = 0;
for (const { indicators, buttons, unk, numLights } of entries) {
  let target = indicators;
  let start = ".".repeat(numLights);
  let queue = [{ state: start, depth: 0 }];
  let visited = new Set();
  while (queue.length > 0) {
    const { state, depth } = queue.shift();
    if (state === target) {
      presses += depth;
      console.log(depth);
      break;
    }

    for (const button of buttons) {
      const newState = applyButton(state, button);
      if (!visited.has(newState)) {
        visited.add(newState);
        queue.push({ state: newState, depth: depth + 1 });
      }
    }
  }
}

console.log(presses);
