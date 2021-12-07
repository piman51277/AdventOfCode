import fs from 'fs';
const input = fs.readFileSync('src/2021/7/input.txt', 'utf8').split(',').map(Number);
const min = Math.min(...input);
const max = Math.max(...input);
let smallestFuelCost = 0;
for (let i = min; i <= max; i++) {
	let currentCost = 0;
	input.forEach(poss => {currentCost += Math.abs(poss - i)});
	if (currentCost < smallestFuelCost || smallestFuelCost === 0) {
		smallestFuelCost = currentCost;
	}
}
console.log(smallestFuelCost);