import fs from 'fs';
const input = fs.readFileSync('./src/2015/5/input.txt', 'utf8').split('\n');
let nice = 0;

//not too proud of this one
const alphabet = "qwertyuiopasdfghjklzxcvbnm".split('');
const combinations = [];
for (let i = 0; i < alphabet.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
        combinations.push(`${alphabet[i]}${alphabet[j]}${alphabet[i]}`)
    }
}
const regex = new RegExp(`(${combinations.join('|')})`, 'g');

for (const str of input) {
    const pairs = str.split('').map((n, i, a) => n + a[i + 1]).filter(n => !n.includes("undefined"));
    let doublePairs = 0;
    for (let i = 0; i < pairs.length; i++) {
        const val = pairs[i];
        if (pairs.filter(n => n == val).length >= 2) {
            const [c1, c2] = val.split('');
            if (c1 == c2) {
                if (str.indexOf(val + c1) != -1) {
                    if (pairs[i - 1] == val && pairs[i + 1] == val) {
                        doublePairs++;
                        break;
                    }
                    continue;
                }
            }
            doublePairs++;
            break;
        }
    }
    if (doublePairs == 0) continue;
    const matches = str.match(regex) || [];
    if (matches.length == 0) continue;

    nice++;
}

console.log(nice);

