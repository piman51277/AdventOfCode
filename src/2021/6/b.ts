import fs from 'fs';
const input = fs.readFileSync('src/2021/6/input.txt', 'utf8').split(',');
const holes = [0, 0, 0, 0, 0, 0, 0, 0];
input.forEach(i => holes[i]++);
for (let i = 0; i < 256; i++) {
    const first = holes.shift();
    holes[8] = first;
    holes[6] = holes[6] || 0;
    holes[6] += first;
}
console.log(holes.reduce((a, b) => a + b));