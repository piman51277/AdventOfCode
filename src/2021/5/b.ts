import fs from 'fs';
const input = fs.readFileSync('./src/2021/5/input.txt', 'utf8').split(/\r?\n/);
const seafloor = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

type Line = {
	x1: number,
	y1: number,
	x2: number,
	y2: number
}
function parseLine(line: string): Line {
	const [x1, y1, x2, y2] = line.replace(/(,| -> )/g, '_').split('_').map(Number);
	return { x1, y1, x2, y2 };
}

function isDiagonal(line: Line): boolean {
	return !(line.y1 === line.y2 || line.x1 === line.x2);
}

const lines = input.map(parseLine);
for (const line of lines) {
	if (!isDiagonal(line)) {
		for (let i = Math.min(line.x1, line.x2); i <= Math.max(line.x1, line.x2); i++) {
			for (let j = Math.min(line.y1, line.y2); j <= Math.max(line.y1, line.y2); j++) {
				seafloor[i][j]++;
			}
		}
	}
	else{
		const interval = Math.abs(line.x1 - line.x2);
		const stepX = line.x1 < line.x2 ? 1 : -1;
		const stepY = line.y1 < line.y2 ? 1 : -1;
		for (let i = 0; i <= interval; i++) {
			seafloor[line.x1 + stepX * i][line.y1 + stepY * i]++;
		}
	}
}

//count how many squares are above 1
let count = 0;
for (const row of seafloor) {
	for (const square of row) {
		if (square > 1) count++;
	}
}

console.log(count);