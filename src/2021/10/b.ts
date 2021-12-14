import fs from 'fs';
const input = fs.readFileSync('src/2021/10/input.txt', 'utf8').split(/\r?\n/);

//stack
const illegals = {
	']': 0,
	')': 0,
	'}': 0,
	'>': 0
};
const completions = [];
for (let i = 0; i < input.length; i++) {
	const line = input[i];
	const stack = [];
	let isLineValid = true;
	linereader:
	for (let k = 0; k < line.length; k++) {
		const char = line[k];


		const stackTop = stack[stack.length - 1];
		const lt = stackTop === '<' && char !== '>';
		const paren = stackTop === '(' && char !== ')';
		const brace = stackTop === '{' && char !== '}';
		const bracket = stackTop === '[' && char !== ']';

		if (['(', '{', '[', '<'].includes(char)) {
			stack.push(char);
			continue;
		}
		else if (lt || paren || brace || bracket) {
			illegals[char]++;
			isLineValid = false;
			break linereader;
		}

		stack.pop();

	}

	if (isLineValid){
		
		//loop through the stack
		let score = 0;
		for (let k = stack.length; k >= 0; k--) {
			score *= 5;
			const char = stack[k];
			if (char === '(') score++;
			else if(char === '[') score += 2;
			else if(char === '{') score += 3;
			else if(char === '<') score += 4;
		}

		completions.push(score);
	}
}

//print out median of completions
const sorted = completions.sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
console.log(median);