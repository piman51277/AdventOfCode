import fs from 'fs';
const input = fs.readFileSync('src/2021/8/input.txt', 'utf8').split(/\r?\n/);
const parsed = input.map(line => line.split(' | ').map(s=>s.split(' ')));
const count = parsed.map(entry => entry[1].filter(s => [2,3,4,7].includes(s.length)).length).reduce((a,b) => a+b);
console.log(count);