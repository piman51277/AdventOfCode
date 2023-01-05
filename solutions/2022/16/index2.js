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
function evalRoute(younodes, elephantnodes) {
  //copy younodes and elephantnodes
  younodes = [...younodes];
  elephantnodes = [...elephantnodes];

  //if an element in the timefram is non-null the valve starts on that frame
  let timeframe = new Array(30).fill(null).map((n) => []);

  let time = 26;
  let current = "AA";
  while (time > 0) {
    const next = younodes.shift();
    if (next === undefined) {
      break;
    }
    const travelTime = newGraph[current].travelTimes[next];
    if (travelTime > time) {
      break;
    }
    time -= travelTime + 1;
    timeframe[26 - time].push(next);
    current = next;
  }

  time = 26;
  current = "AA";
  while (time > 0) {
    const next = elephantnodes.shift();
    if (next === undefined) {
      break;
    }
    const travelTime = newGraph[current].travelTimes[next];
    if (travelTime > time) {
      break;
    }
    time -= travelTime + 1;
    timeframe[26 - time].push(next);
    current = next;
  }

  //anaylze the timefram
  let flow = 0;
  let total = 0;
  for (let i = 0; i < 26; i++) {
    const nodes = timeframe[i];
    for (let node of nodes) {
      flow += newGraph[node].flowRate;
    }
    total += flow;
  }

  return total;
}

//find viable permutations of the nodes

//get all keys and sort by flow
const nodes = Object.keys(newGraph)
  .filter((node) => node !== "AA")
  .sort((a, b) => newGraph[b].flowRate - newGraph[a].flowRate);

//get all permutations of array eleemnts

function getPermutationsOfNodes(current, tovisit, remainingTime, pathlength) {
  //if pathlength is 1
  if (pathlength === 1) {
    return tovisit.map((node) => [node]);
  }

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

    //if it is possible to visit the next node in time
    if (newRemainingTime >= newGraph[newCurrent].travelTimes[newTovisit[0]]) {
      const next = getPermutationsOfNodes(
        newCurrent,
        newTovisit,
        newRemainingTime,
        pathlength - 1
      );

      //attach the current node to the front of the next step
      for (let n of next) {
        n = [node, ...n];
        nextStep.push(n);
      }
    }
  }

  return nextStep;
}

let max = 0;
for (let maxInitialPath = 5; maxInitialPath <= 8; maxInitialPath++) {
  console.log(`Processing ${maxInitialPath} initial path length...`);
  const vals = getPermutationsOfNodes("AA", nodes, 26, maxInitialPath);

  //evaluate all permutations
  for (let val of vals) {
    //get all elephant routes
    const leftover = nodes.filter((node) => !val.includes(node));
    const elephantRoutes = getPermutationsOfNodes("AA", leftover, 26, Infinity);
    for (let route of elephantRoutes) {
      const total = evalRoute(val, route);
      if (total > max) {
        max = total;
      }
    }
  }
}
console.log(max);
