import fs from 'fs';
const input = fs.readFileSync('./src/2021/3/input.txt', 'utf8').split('\n');
const count1 = new Array(input[0].length).fill(0);
const count0 = new Array(input[0].length).fill(0);
for (const str of input) {
    const strArray = str.split('');
    for (let i = 0; i < strArray.length; i++) {
        if (strArray[i] == "0") {
            count0[i]++;
        }
        else {
            count1[i]++;
        }
    }
}
let outputG = "";
let outputE = "";
for (let i = 0; i < count1.length; i++) {
    outputE += count0[i] > count1[i] ? 0 : 1;
    outputG += count0[i] > count1[i] ? 1 : 0;
}
const gamma = parseInt(outputG, 2);
const epsilon = parseInt(outputE, 2);
console.log(gamma * epsilon);