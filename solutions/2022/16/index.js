const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const valves = {};
for (const line of input) {
  const parts = line.split("; ");
  const valveName = parts[0].split(" ")[1];
  const flowRate = parseInt(parts[0].split(" ")[4].replace("rate=", ""));
  const children = parts[1]
    .split(" ")
    .slice(4)
    .map((child) => child.replace(",", ""));

  valves[valveName] = { flowRate, children };
}

function distanceBetween(startNode, endNode) {
  //do BFS to figure out distance between startNode and endNode
  let working = [startNode];
  let visited = new Set();
  let distance = 0;
  while (working.length > 0) {
    let next = [];
    for (let node of working) {
      if (node === endNode) {
        return distance;
      }
      for (let child of valves[node].children) {
        if (!visited.has(child)) {
          next.push(child);
          visited.add(child);
        }
      }
    }
    distance++;
    working = next;
  }

  return -1;
}

//get the list of node names with nonzero flow
const newNodes = Object.keys(valves).filter(
  (node) => valves[node].flowRate > 0
);

//add AA
newNodes.push("AA");

//create a new graph with only the nodes with nonzero flow
const newGraph = {};
for (let node of newNodes) {
  const travelTimes = {};
  for (let otherNode of newNodes) {
    if (node !== otherNode) {
      travelTimes[otherNode] = distanceBetween(node, otherNode);
    }
  }
  newGraph[node] = {
    flowRate: valves[node].flowRate,
    travelTimes,
  };
}

//follow the set path and see how much flow is gained
function evalRoute(nodes) {
  let flow = 0;
  let total = 0;
  let time = 30;
  let current = "AA";

  while (time > 0) {
    const next = nodes.shift();
    if (next === undefined) {
      break;
    }
    const travelTime = newGraph[current].travelTimes[next];
    if (travelTime > time) {
      break;
    }
    time -= travelTime + 1;
    total += flow * (travelTime + 1);
    flow += newGraph[next].flowRate;
    current = next;
  }

  //add on the remaining flow
  total += flow * time;

  return total;
}

//find viable permutations of the nodes

//get all keys and sort by flow
const nodes = Object.keys(newGraph)
  .filter((node) => node !== "AA")
  .sort((a, b) => newGraph[b].flowRate - newGraph[a].flowRate);

function getPermutationsOfNodes(current, tovisit, remainingTime) {
  //get all nodes that we can visit
  const possible = tovisit.filter(
    (node) => newGraph[current].travelTimes[node] <= remainingTime
  );

  //if we can't visit any nodes, we're done
  if (possible.length === 1) {
    return [possible];
  }

  //permute over all possible nodes
  let nextStep = [];
  for (let node of possible) {
    const newTovisit = tovisit.filter((n) => n !== node);
    const newRemainingTime =
      remainingTime - newGraph[current].travelTimes[node];
    const newCurrent = node;
    const next = getPermutationsOfNodes(
      newCurrent,
      newTovisit,
      newRemainingTime
    );

    //attach the current node to the front of the next step
    for (let n of next) {
      n = [node, ...n];
      nextStep.push(n);
    }
  }

  return nextStep;
}

const vals = getPermutationsOfNodes("AA", nodes, 30);

//evaluate all permutations
let max = 0;
for (let val of vals) {
  const total = evalRoute(val);
  if (total > max) {
    max = total;
  }
}

console.log(max);
