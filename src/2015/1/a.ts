import fs from 'fs';
const input = fs.readFileSync('./src/2015/1/input.txt', 'utf8');
console.log(input.match(/\(/g).length - input.match(/\)/g).length);