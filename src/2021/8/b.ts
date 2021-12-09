import fs from 'fs';
const input = fs.readFileSync('src/2021/8/input.txt', 'utf8').split(/\r?\n/);
const parsed = input.map(line => line.split(' | ').map(s => s.split(' ')));

function getDiff(a: string, b: string): string {
	const splitA = a.split('');
	const splitB = b.split('');
	splitA.forEach((c, i) => {
		if (splitB.includes(c)) {
			splitA[i] = null;
			splitB[splitB.indexOf(c)] = null;
		}
	});
	return splitA.filter(c => c !== null).concat(splitB.filter(c => c !== null)).join('');
}

function includes(a: string, b: string): boolean {
	return a.split('').filter(c => b.includes(c)).length === a.length;
}

//sort chars in a string
function sort(a: string): string {
	return a.split('').sort().join('');
}

let outputSum = 0;
for (const line of parsed) {
	let [decode, message] = line;
	decode = decode.map(sort);
	message = message.map(sort);
	const numbers = [];

	//decode message
	decode = decode.sort((a, b) => a.length - b.length);
	numbers[1] = decode[0];
	numbers[7] = decode[1];
	numbers[4] = decode[2];
	numbers[8] = decode[9];

	//find bd
	const bd = getDiff(numbers[4], numbers[1]);
	const len5 = decode.slice(3, 6);
	numbers[5] = len5.filter(s => includes(bd, s))[0];
	numbers[3] = len5.filter(s => includes(numbers[1], s))[0];
	numbers[2] = len5.filter(s => ![numbers[3], numbers[5]].includes(s))[0];

	//find 6 0 9
	const len6 = decode.slice(6, 9);
	numbers[0] = len6.filter(s => !includes(bd, s))[0];
	numbers[6] = len6.filter(s => !includes(numbers[1], s))[0];
	numbers[9] = len6.filter(s => ![numbers[0], numbers[6]].includes(s))[0];

	//decode output
	let messageStr = '';
	for (let i = 0; i < message.length; i++) {
		messageStr += numbers.indexOf(message[i]);
	}
	const output = parseInt(messageStr, 10);
	outputSum += output;
}
console.log(outputSum);