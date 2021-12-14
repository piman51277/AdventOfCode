import fs from 'fs';
const input = fs.readFileSync('src/2021/10/input.txt', 'utf8').split(/\r?\n/);

//stack
const illegals = {
	']': 0,
	')': 0,
	'}': 0,
	'>': 0 
};
for (let i = 0; i < input.length; i++) {
	const line = input[i];
	const stack = [];
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
			break linereader;
		}
		
		stack.pop();

	}
}

console.log(illegals[')'] * 3 + illegals[']'] * 57 + illegals['}'] * 1197 + illegals['>'] * 25137);