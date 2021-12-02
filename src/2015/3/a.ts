import fs from 'fs';
const input = fs.readFileSync('./src/2015/3/input.txt', 'utf8').split('');
const visitedHouses = new Set<string>();
visitedHouses.add('0,0');
let x = 0;
let y = 0;
for(const char of input){
    switch(char){
        case '^':
            y++;
            break;
        case 'v':
            y--;
            break;
        case '<':
            x--;
            break;
        case '>':
            x++;
            break;
    }
    visitedHouses.add(`${x},${y}`);
}
console.log(visitedHouses.size);