import fs from 'fs';
const depths = fs.readFileSync('./src/2021/1/input.txt', 'utf8').split('\n').map(Number);
let count =0;
depths.forEach((n,i)=>{
    if(i>=1 && depths[i] > depths[i-1]) count++;
});
console.log(count);