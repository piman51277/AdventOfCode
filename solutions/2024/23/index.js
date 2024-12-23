const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop();

const connections = {};
for (const line of input) {
  const [first, second] = line.split("-");
  if (!connections[first]) connections[first] = [];
  if (!connections[second]) connections[second] = [];
  connections[first].push(second);
  connections[second].push(first);
}
const computers = Object.keys(connections);

let cont = 0;
const triplets = new Set();
for (const comp of computers) {
  if (comp[0] != "t") continue;

  //look for two other computers that are connected to current and each other
  const conns = connections[comp];

  for (let i = 0; i < conns.length; i++) {
    const conn1 = conns[i];
    for (let j = i + 1; j < conns.length; j++) {
      const conn2 = conns[j];
      if (connections[conn1].includes(conn2)) {
        const trip = [comp, conn1, conn2].sort().join("-");
        triplets.add(trip);
      }
    }
  }
}

console.log(triplets.size);
