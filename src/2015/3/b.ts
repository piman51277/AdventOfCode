import fs from 'fs';
const input = fs.readFileSync('./src/2015/3/input.txt', 'utf8').split('');
const visitedHouses = new Set<string>();
visitedHouses.add('0,0');
let x = 0;
let y = 0;
let x1 = 0;
let y1 = 0;
for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (i % 2 == 0) {
        switch (char) {
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
    }else{
        switch (char) {
            case '^':
                y1++;
                break;
            case 'v':
                y1--;
                break;
            case '<':
                x1--;
                break;
            case '>':
                x1++;
                break;
        }
        visitedHouses.add(`${x1},${y1}`);    
    }
    
}
console.log(visitedHouses.size);