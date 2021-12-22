import fs from 'fs';
const input = fs.readFileSync('src/2021/13/input.txt', 'utf8').split(/\r?\n/);
let dots = [];
const instructions = [];
for (const line of input) {
	if (line.indexOf(',') != -1) {
		const [x, y] = line.split(',').map(Number);
		dots.push([x, y]);
	}
	else if (line.indexOf("fold along") != -1) {
		const [, dir] = line.split("fold along ");
		instructions.push(dir);
	}
}

const instruction = instructions[0];
const args = instruction.split("=");
const axis = args[0];
const start = Number(args[1]);

if (axis == "x") {
	dots = dots.map(([x, y]) => {
		if (x > start) {
			const delta = x - start;
			return [start - delta, y];
		} else {
			return [x, y];
		}
	});
}
else if (axis == "y") {
	dots = dots.map(([x, y]) => {
		if (y > start) {
			const delta = y - start;
			return [x, start - delta];
		} else {
			return [x, y];
		}
	});
}

//remove duplicate dots
dots = dots.filter(([x, y], i) => {
	for (let j = 0; j < i; j++) {
		if (dots[j][0] == x && dots[j][1] == y) {
			return false;
		}
	}
	return true;
});


console.log(dots.length);