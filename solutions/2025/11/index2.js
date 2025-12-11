const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();
let devices = [];

for (const line of input) {
  let [id, conns] = line.split(": ");
  conns = conns.split(" ");
  devices.push({ id, conns });
}

const inDegree = {};
const adjList = {};
const allNodes = new Set();
for (const device of devices) {
  allNodes.add(device.id);
  if (!adjList[device.id]) adjList[device.id] = [];
  if (!inDegree[device.id]) inDegree[device.id] = 0;

  for (const conn of device.conns) {
    allNodes.add(conn);
    if (!adjList[conn]) adjList[conn] = [];
    if (!inDegree[conn]) inDegree[conn] = 0;

    adjList[device.id].push(conn);
    inDegree[conn]++;
  }
}
const queue = [];
for (const node of allNodes) {
  if (inDegree[node] === 0) {
    queue.push(node);
  }
}
const sortedDevices = [];
while (queue.length > 0) {
  const node = queue.shift();
  sortedDevices.push(node);
  for (const neighbor of adjList[node] || []) {
    inDegree[neighbor]--;
    if (inDegree[neighbor] === 0) {
      queue.push(neighbor);
    }
  }
}
if (sortedDevices.length !== allNodes.size) {
  return null;
}

function numWays(start, end, forbidden = []) {
  cache = {};

  //get order # of the start and end
  const startIdx = sortedDevices.indexOf(start);
  const endIdx = sortedDevices.indexOf(end);
  const forbiddenSet = new Set(forbidden);

  for (let i = startIdx; i <= endIdx; i++) {
    const deviceId = sortedDevices[i];
    if (forbiddenSet.has(deviceId)) {
      cache[deviceId] = 0;
      continue;
    }
    if (deviceId === start) {
      cache[deviceId] = 1;
      continue;
    }

    let totalWays = 0;
    for (const device of devices) {
      if (device.conns.includes(deviceId)) {
        totalWays += cache[device.id] || 0;
      }
    }
    cache[deviceId] = totalWays;
  }

  return cache[end] || 0;
}

console.log(
  numWays("svr", "fft", ["dac"]) *
    numWays("fft", "dac", ["svr"]) *
    numWays("dac", "out", ["fft", "svr"])
);
