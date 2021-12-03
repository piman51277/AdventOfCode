import fs from 'fs';
const movements = fs.readFileSync('./src/2021/2/input.txt', 'utf8').split(/\r?\n/);
let x = 0;
let y = 0;
for (const entry of movements) {
    const [code, rawValue] = entry.split(' ');
    const value = parseInt(rawValue);
    switch (code) {
        case "forward":
            x += value;
            break;
        case "down":
            y += value;
            break;
        case "up":
            y -= value;
            break;
    }
}
console.log(x * y);
