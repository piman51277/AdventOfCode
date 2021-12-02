import fs from 'fs';
const input = fs.readFileSync('./src/2015/1/input.txt', 'utf8');
let floor = 0;
for(let i = 0; i < input.length; i++) {
    if(input[i] === '(') {
        floor += 1;
    } else {
        floor -= 1;
    }
    if(floor === -1) {
        console.log(i + 1);
        break;
    }
}