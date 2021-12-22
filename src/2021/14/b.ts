import fs from 'fs';
const input = fs.readFileSync('src/2021/14/input.txt', 'utf8').split(/\r?\n/).filter(n => n != '');

const [template, ...replacementsRaw] = input;
const replacementsList = replacementsRaw.map(r => r.split(' -> '));
const replacements = {};
for (const [from, to] of replacementsList) {
	replacements[from] = to;
}

//split the template up into a list of pairs
const pairs = {};
for (let i = 0; i < template.length - 1; i++) {
	const str = template.substring(i, i + 2);
	if (replacements[str]) {
		pairs[str] = pairs[str] ? pairs[str] + 1 : 1;
	}
}

function iterate(pairData) {
	const newPairs = {};
	for (const pairName in pairData) {
		const replacement = replacements[pairName];

		if (!replacement) {
			newPairs[pairName] = pairData[pairName];
			continue;
		}

		const [a, b] = pairName.split('');
		const pair0 = a + replacement;
		const pair1 = replacement + b;

		newPairs[pair0] = newPairs[pair0] ? newPairs[pair0] + pairData[pairName] : pairData[pairName];
		newPairs[pair1] = newPairs[pair1] ? newPairs[pair1] + pairData[pairName] : pairData[pairName];
	}
	return newPairs;
}

let workingSet = pairs;
for(let i = 0; i < 40; i++) {
	workingSet = iterate(workingSet);
}

const elementOccurances: { [key: string]: number } = {};
for (const element in workingSet) {
	const [a,b] = element.split('');
	elementOccurances[a] = elementOccurances[a] ? elementOccurances[a] + workingSet[element] : workingSet[element];
	elementOccurances[b] = elementOccurances[b] ? elementOccurances[b] + workingSet[element] : workingSet[element];
}

//divide the counts by 2
for (const element in elementOccurances) {
	elementOccurances[element] = Math.floor(elementOccurances[element] / 2);
}

//add 1 to the count of the first element in template
elementOccurances[template[0]] = elementOccurances[template[0]] + 1;

//add 1 to the count of the last element in template
elementOccurances[template[template.length - 1]] = elementOccurances[template[template.length - 1]] + 1;

const maxCount = Object.values(elementOccurances).reduce((a, b) => Math.max(a, b));
const minCount = Object.values(elementOccurances).reduce((a, b) => Math.min(a, b));

console.log(maxCount - minCount);