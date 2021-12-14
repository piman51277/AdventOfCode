import fs from 'fs';
const input = fs.readFileSync('src/2021/9/input.txt', 'utf8').split(/\r?\n/).map(n => n.split('').map(Number));

//find all lowest points
const points = [];

for (let x = 0; x < input.length; x++) {
	for (let y = 0; y < input[x].length; y++) {
		const val = input[x][y];

		//check if adjacent positions are less
		let islessThanAll = true;
		if (x > 0 && input[x - 1][y] <= val) islessThanAll = false;
		if (x < input.length - 1 && input[x + 1][y] <= val) islessThanAll = false;
		if (y > 0 && input[x][y - 1] <= val) islessThanAll = false;
		if (y < input[x].length - 1 && input[x][y + 1] <= val) islessThanAll = false;

		if (islessThanAll) {
			points.push({ x, y });
		}
	}
}

function encodePosition(x, y): string {
	return `${x},${y}`;
}

function getBasinSize(x,y): number {

	const cache = [];
	const queue = [];
	let positions = 0;
	queue.push({ x, y });
	while(queue.length > 0) {
		const { x, y } = queue.shift();
		const key = encodePosition(x, y);
		if (cache[key]){
			continue;
		}
		cache[key] = true;
		if(input[x][y] == 9){
			continue;
		}
		positions++;
		if (x > 0 && input[x - 1][y] >= input[x][y]) queue.push({ x: x - 1, y });
		if (x < input.length - 1 && input[x + 1][y] >= input[x][y]) queue.push({ x: x + 1, y });
		if (y > 0 && input[x][y - 1] >= input[x][y]) queue.push({ x, y: y - 1 });
		if (y < input[x].length - 1 && input[x][y + 1] >= input[x][y]) queue.push({ x, y: y + 1 });
	}

	return positions;
}
const basinSizes = [];
points.forEach(({ x, y }) => {
	basinSizes.push(getBasinSize(x, y));
});

basinSizes.sort((a, b) => b - a);
console.log(basinSizes.slice(0,3).reduce((a, b) => a * b));