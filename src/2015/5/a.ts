import fs from 'fs';
const input = fs.readFileSync('./src/2015/5/input.txt', 'utf8').split('\n');
let nice = 0;
for (const str of input) {
    const vowels = str.match(/[aeiou]/g) || [];
    const doubles = str.match(/(qq|ww|ee|rr|tt|yy|uu|ii|oo|pp|aa|ss|dd|ff|gg|hh|jj|kk|ll|zz|xx|cc|vv|bb|nn|mm)/g) || [];
    const excludes = str.match(/(ab|cd|pq|xy)/g) || [];
    if (vowels.length >= 3 && doubles.length >= 1 && excludes.length == 0) nice++;
}
console.log(nice);