const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const points = [];

class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(u) {
    if (this.parent[u] !== u) {
      this.parent[u] = this.find(this.parent[u]);
    }
    return this.parent[u];
  }

  union(u, v) {
    const rootU = this.find(u);
    const rootV = this.find(v);

    if (rootU !== rootV) {
      if (this.rank[rootU] > this.rank[rootV]) {
        this.parent[rootV] = rootU;
      } else if (this.rank[rootU] < this.rank[rootV]) {
        this.parent[rootU] = rootV;
      } else {
        this.parent[rootV] = rootU;
        this.rank[rootU]++;
      }
    }
  }
}

for (const line of input) {
  const [x, y, z] = line.split(",").map(Number);
  points.push({ x, y, z });
}

const distances = [];

for (let i = 0; i < points.length; i++) {
  for (let j = i + 1; j < points.length; j++) {
    if (i !== j) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dz = points[i].z - points[j].z;
      distances.push({
        i,
        j,
        distance: Math.sqrt(dx * dx + dy * dy + dz * dz),
      });
    }
  }
}

distances.sort((a, b) => a.distance - b.distance);

const uf = new UnionFind(points.length);
const seenPairs = new Set();

while (true) {
  let minDistance = Infinity;
  let pair = [null, null];

  const entry = distances.shift();
  const key = entry.i * 10000 + entry.j;
  if (seenPairs.has(key)) {
    continue;
  }
  minDistance = entry.distance;
  pair = [entry.i, entry.j];

  seenPairs.add(pair[0] * 10000 + pair[1]);
  seenPairs.add(pair[1] * 10000 + pair[0]);
  if (uf.find(pair[0]) === uf.find(pair[1])) {
    continue;
  } else {
    uf.union(pair[0], pair[1]);

    let fullyConnected = true;
    const root = uf.find(0);
    for (let i = 1; i < points.length; i++) {
      if (uf.find(i) !== root) {
        fullyConnected = false;
        break;
      }
    }
    if (fullyConnected) {
      console.log(points[pair[0]].x * points[pair[1]].x);
      break;
    }
  }
}
