import fs from 'fs';
const input = fs.readFileSync('./src/2015/6/input.txt', 'utf8').split('\n');

//setup grid
const grid = new Uint8Array(1000000).fill(0);

//helper function
const getGridPos = (function (x: number, y: number): number {
    return x * 1000 + y;
});

for (const line of input) {
    const [head, p1] = line.split(" through ");
    const [a, b, c] = head.split(' ');
    let instruction;
    let p0;
    if (c) {
        instruction = a + " " + b;
        p0 = c;
    } else {
        instruction = a;
        p0 = b;
    }
    let transformationFunc;
    switch (instruction) {
        case "turn on":
            transformationFunc = n => n + 1;
            break;
        case "turn off":
            transformationFunc = n => Math.max(0, n - 1);
            break;
        case "toggle":
            transformationFunc = n => n +2;
            break;
    }
    const [p0x, p0y] = p0.split(',');
    const [p1x, p1y] = p1.split(',');
    for (let x = Number(p0x); x <= Number(p1x); x++) {
        for (let y = Number(p0y); y <= Number(p1y); y++) {
            const indexPos = getGridPos(x, y);
            grid[indexPos] = transformationFunc(grid[indexPos]);
        }
    }
}

console.log(grid.reduce((a, b) => a + b));