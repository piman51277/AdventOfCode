import fs from 'fs';
const depths = fs.readFileSync('./src/2021/1/input.txt', 'utf8').split('\n').map(Number);
const sums = [];
depths.forEach((n, i) => {
    if (i >= 2) sums.push(depths[i] + depths[i - 1] + depths[i - 2]);
});
let count =0;
sums.forEach((n,i)=>{
    if(i>=1 && sums[i] > sums[i-1]) count++;
});
console.log(count);