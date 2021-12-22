import fs from 'fs';
const input = fs.readFileSync('src/2021/12/input.txt', 'utf8').split(/\r?\n/);

//parse input file and create paths dictionary
const paths = {};
for (const line of input) {
	const [from, to] = line.split('-');
	paths[from] = paths[from] ? paths[from].concat(to) : [to];
	paths[to] = paths[to] ? paths[to].concat(from) : [from];
}

function isLargeCave(id: string) {
	return /[A-Z]+/.test(id);
}

function getNextBranch(id: string) {
	const possibilities = paths[id];
	return possibilities;
}

let foundPaths = 0;
function findPaths(current: string, visited: string[]) {
	if (visited.includes(current) && !isLargeCave(current)) return;
	visited.push(current);
	if (current == "end") {
		foundPaths++;
		return;
	}
	const nextBranches = getNextBranch(current);
	for (const nextBranch of nextBranches) {
		findPaths(nextBranch, visited.slice());
	}
}


findPaths("start", []);
console.log(foundPaths);