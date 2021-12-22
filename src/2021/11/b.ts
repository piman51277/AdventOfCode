import fs from 'fs';
const input = fs.readFileSync('src/2021/11/input.txt', 'utf8').split(/\r?\n/);
const grid = input.map(line => line.split('').map(Number));
const gridSize = [grid.length, grid[0].length];

function valueAtPosition(x: number, y: number) {
	if (x < 0 || y < 0 || x >= gridSize[0] || y >= gridSize[1]) {
		return -1;
	}
	return grid[x][y];
}

function iterate() {

	const toFlash = [];
	const hasFlashed = [];

	//go over every entry and increment by 1

	for (let y = 0; y < gridSize[0]; y++) {
		for (let x = 0; x < gridSize[1]; x++) {
			grid[x][y] += 1;

			if (grid[x][y] > 9) {
				toFlash.push([x, y]);
			}
		}
	}

	while (toFlash.length > 0) {
		const [x, y] = toFlash.shift();
		if (hasFlashed.includes(`${x},${y}`)) {
			continue;
		}

		hasFlashed.push(`${x},${y}`);

		const topLeft = valueAtPosition(x - 1, y - 1);
		if (topLeft != -1) {
			if (topLeft == 9) {
				toFlash.push([x - 1, y - 1]);
			} else {
				grid[x - 1][y - 1] += 1;
			}
		}

		const top = valueAtPosition(x, y - 1);
		if (top != -1) {
			if (top == 9) {
				toFlash.push([x, y - 1]);
			}
			else {
				grid[x][y - 1] += 1;
			}
		}

		const topRight = valueAtPosition(x + 1, y - 1);
		if (topRight != -1) {
			if (topRight == 9) {
				toFlash.push([x + 1, y - 1]);
			}
			else {
				grid[x + 1][y - 1] += 1;
			}
		}

		const left = valueAtPosition(x - 1, y);
		if (left != -1) {
			if (left == 9) {
				toFlash.push([x - 1, y]);
			}
			else {
				grid[x - 1][y] += 1;
			}
		}

		const right = valueAtPosition(x + 1, y);
		if (right != -1) {
			if (right == 9) {
				toFlash.push([x + 1, y]);
			}
			else {
				grid[x + 1][y] += 1;
			}
		}

		const bottomLeft = valueAtPosition(x - 1, y + 1);
		if (bottomLeft != -1) {
			if (bottomLeft == 9) {
				toFlash.push([x - 1, y + 1]);
			}
			else {
				grid[x - 1][y + 1] += 1;
			}
		}

		const bottom = valueAtPosition(x, y + 1);
		if (bottom != -1) {
			if (bottom == 9) {
				toFlash.push([x, y + 1]);
			}
			else {
				grid[x][y + 1] += 1;
			}
		}

		const bottomRight = valueAtPosition(x + 1, y + 1);
		if (bottomRight != -1) {
			if (bottomRight == 9) {
				toFlash.push([x + 1, y + 1]);
			}
			else {
				grid[x + 1][y + 1] += 1;
			}
		}
	}

	for (const cell of hasFlashed) {
		const [x, y] = cell.split(',').map(Number);
		grid[x][y] = 0;
	}
}

function isAllZero() {
	for (let y = 0; y < gridSize[0]; y++) {
		for (let x = 0; x < gridSize[1]; x++) {
			if (grid[x][y] != 0) {
				return false;
			}
		}
	}
	return true;
}

let iterations = 0;
// eslint-disable-next-line no-constant-condition
while (true) {
	iterate();
	iterations++;
	if (isAllZero()) {
		console.log(iterations);
		break;
	}
}