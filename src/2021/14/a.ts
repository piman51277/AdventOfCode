import fs from 'fs';
const input = fs.readFileSync('src/2021/14/input.txt', 'utf8').split(/\r?\n/).filter(n => n != '');

const [template, ...replacementsRaw] = input;
const replacementsList = replacementsRaw.map(r => r.split(' -> '));
const replacements = {};
for (const [from, to] of replacementsList) {
	replacements[from] = to;
}

function iterate(input) {
	let zip = "";
	for (let i = 0; i < input.length - 1; i++) {
		const str = input.substring(i, i + 2);
		if (replacements[str]) {
			zip += replacements[str];
		} else {
			zip += ' ';
		}
	}

	//zip together input and zip
	let output = "";
	for (let i = 0; i < input.length - 1; i++) {
		output += input[i] + zip[i];
	}
	output += input[input.length - 1];

	return output.replace(/ /g, '');
}

let workingValue = template;
for (let i = 0; i < 10; i++) {
	workingValue = iterate(workingValue);
}

const workingValueArray = workingValue.split('');
const elementList = new Array(...new Set(workingValueArray));

const elementCounts: { [key: string]: number } = {};
for (const element of elementList) {
	elementCounts[element] = workingValueArray.filter(n => n == element).length;
}

//find the largest count
const maxCount = Object.values(elementCounts).reduce((a, b) => Math.max(a, b));
const minCount = Object.values(elementCounts).reduce((a, b) => Math.min(a, b));

console.log(maxCount - minCount);