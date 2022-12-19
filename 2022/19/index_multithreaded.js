const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const blueprints = [];
for (const line of input) {
  const parts = line.split(" ");
  const blueprintid = parseInt(parts[1].replace(":", ""));
  const oreCost = parseInt(parts[6]);
  const clayCost = parseInt(parts[12]);
  const obsidianCostOre = parseInt(parts[18]);
  const obsidianCostClay = parseInt(parts[21]);
  const geodeCostOre = parseInt(parts[27]);
  const geodeCostObsidian = parseInt(parts[30]);
  blueprints[blueprintid - 1] = {
    oreCost,
    clayCost,
    obsidianCostOre,
    obsidianCostClay,
    geodeCostOre,
    geodeCostObsidian,
    blueprintid,
  };
}

const MAX_THREADS = 22;

const workQueue = [...blueprints];
let sum = 0;
let returnedResults = 0;

//spawn workers
const { fork } = require("child_process");
const workers = [];
for (let i = 0; i < Math.min(MAX_THREADS, workQueue.length); i++) {
  const worker = fork("./worker.js");
  workers.push(worker);
}

//handle messages
for (const worker of workers) {
  worker.on("message", (msg) => {
    if (workQueue.length > 0) {
      const input = workQueue.pop();
      worker.send({ msg: { input } });
    } else {
      worker.kill();
    }

    const output = msg.output;
    sum += output.geodes * output.id;

    returnedResults++;
    if (returnedResults === blueprints.length) {
      console.log(sum);
    }
  });
}

//start the workers
for (const worker of workers) {
  if (workQueue.length > 0) {
    const input = workQueue.pop();
    worker.send({ msg: { input } });
  }
}
