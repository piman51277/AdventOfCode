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
const iterations = 1000;

for (let i = 0; i < iterations; i++) {
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
  uf.union(pair[0], pair[1]);
}

let parents = {};
for (let i = 0; i < points.length; i++) {
  const parent = uf.find(i);
  if (!parents[parent]) {
    parents[parent] = 0;
  }
  parents[parent]++;
}

let sizes = Object.values(parents);
sizes.sort((a, b) => b - a);

console.log(sizes[0] * sizes[1] * sizes[2]);
