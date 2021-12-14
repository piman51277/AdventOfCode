import fs from 'fs';
const input = fs.readFileSync('src/2021/9/input.txt', 'utf8').split(/\r?\n/).map(n => n.split('').map(Number));


let pointTotal = 0;
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
			pointTotal += val + 1;
		}
	}
}

console.log(pointTotal);