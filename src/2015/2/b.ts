import fs from 'fs';
const input = fs.readFileSync('./src/2015/2/input.txt', 'utf8').split(/\r?\n/);
function computePresentCost(x, y, z) {
    return 2 * ((x + y + z) - Math.max(x, y, z)) + (x * y * z);
}
let cost = 0;
for (let i = 0; i < input.length; i++) {
    const [x, y, z] = input[i].split('x').map(Number);
    cost += computePresentCost(x, y, z);
}
console.log(cost);