import fs from 'fs';
const input = fs.readFileSync('src/2021/7/input.txt', 'utf8').split(',').map(Number);
const min = Math.min(...input);
const max = Math.max(...input);
let smallestFuelCost = 0;

function sumOfFirstNnumbers(n:number):number {
	let sum = 0;
	for (let i = 1; i <= n; i++) {
		sum += i;
	}
	return sum;
}

for (let i = min; i <= max; i++) {
	let currentCost = 0;
	input.forEach(poss => {
		const diffPos =  Math.abs(poss - i);
		const fuelCost = sumOfFirstNnumbers(diffPos);
		currentCost += fuelCost;
	});
	if (currentCost < smallestFuelCost || smallestFuelCost === 0) {
		smallestFuelCost = currentCost;
	}
}
console.log(smallestFuelCost);

