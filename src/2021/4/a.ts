type BingoBoard = number[];
type BingoState = boolean[]

function parseBingo(input: string): BingoBoard {
    return input.split(/( |(\r?\n))/g).map(n => parseInt(n)).filter(n => !isNaN(n));
}

function getBoardWon(state: BingoState): boolean {
    for (let i = 0; i < state.length / 5; i++) {
        const subArray = state.slice(i * 5, (i + 1) * 5);
        if (subArray.every(n => n)) return true;
    }
    for (let i = 0; i < state.length / 5; i++) {
        const subArray = [];
        for (let j = 0; j < 5; j++) {
            subArray.push(state[j * 5 + i]);
        }
        if (subArray.every(n => n)) return true;
    }
}

import fs from 'fs';
const input = fs.readFileSync('./src/2021/4/input.txt', 'utf8').split('\n');
const numbers = input[0].split(',').map(n => Number(n));
const boards = input.slice(1).join('\n').split(/(\r?\n){2,}/g).filter(n => n.length > 1).map(parseBingo);
const boardStates = new Array(boards.length).fill(0).map(() => new Array(boards[0].length).fill(false));

for (const call of numbers) {
    for (let i = 0; i < boards.length; i++) {
        if (boards[i].indexOf(call) >= 0) {
            boardStates[i][boards[i].indexOf(call)] = true;
            if (getBoardWon(boardStates[i])) {
                let sum = 0;
                const board = boards[i];
                const state = boardStates[i];
                state.forEach((n, i) => { if (!n) sum += board[i]; });
                console.log(sum * call);
                process.exit();
            }
        }
    }
}