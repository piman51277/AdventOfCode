const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();
let devices = [];

for (const line of input) {
  let [id, conns] = line.split(": ");
  conns = conns.split(" ");
  devices.push({ id, conns });
}

let Numpaths = new Map();
let start = "you";
let end = "out";

let queue = [[start]];
while (queue.length > 0) {
  let path = queue.shift();
  let node = path[path.length - 1];

  if (node === end) {
    let pathKey = path.slice(1, -1).sort().join(",");
    Numpaths.set(pathKey, (Numpaths.get(pathKey) || 0) + 1);
    continue;
  }

  let device = devices.find((d) => d.id === node);

  for (const conn of device.conns) {
    if (!path.includes(conn)) {
      let newPath = path.slice();
      newPath.push(conn);
      queue.push(newPath);
    }
  }
}

let totalPaths = 0;
for (const count of Numpaths.values()) {
  totalPaths += count;
}

console.log(totalPaths);
