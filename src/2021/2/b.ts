import fs from 'fs';
const movements = fs.readFileSync('./src/2021/2/input.txt', 'utf8').split(/\r?\n/);
let x = 0;
let y = 0;
let aim = 0;
for (const entry of movements) {
    const [code, rawValue] = entry.split(' ');
    const value = parseInt(rawValue);
    switch (code) {
        case "forward":
            x += value;
            y += value * aim;
            break;
        case "down":
            aim += value;
            break;
        case "up":
            aim -= value;
            break;
    }
}
console.log(x * y);
