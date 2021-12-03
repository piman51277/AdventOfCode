import fs from 'fs';
const input = fs.readFileSync('./src/2021/3/input.txt', 'utf8').split(/\r?\n/);
let workingO = [...input];
let workingC = [...input];

for (let i = 0; i < input[0].length; i++) {
    const count1 = new Array(input[0].length).fill(0);
    const count0 = new Array(input[0].length).fill(0);
    for (const str of workingO) {
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
    const bestValues = count1.map((n, i) => n >= count0[i] ? 1 : 0);
    workingO = workingO.filter(n => n[i] == bestValues[i].toString());

    if (workingO.length == 1) break;
}
for (let i = 0; i < input[0].length; i++) {
    const count1 = new Array(input[0].length).fill(0);
    const count0 = new Array(input[0].length).fill(0);
    for (const str of workingC) {
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
    const bestValues = count0.map((n, i) => n <= count1[i] ? 0 : 1);
    workingC = workingC.filter(n => n[i] == bestValues[i].toString());

    if (workingC.length == 1) break;
}

console.log(parseInt(workingO.join(''), 2) * parseInt(workingC.join(''), 2));