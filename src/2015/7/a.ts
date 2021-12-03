import { interpreter, executor, wires } from "./shared";

//import commands and interpret
import fs from "fs";
const commands = fs.readFileSync('./src/2015/7/input.txt', 'utf8').split(/\r?\n/);
const code = commands.map(interpreter);
for (let i = 0; i < code.length; i++) {
    for (let line = 0; line < code.length; line++) {
        const data = code[line];
        executor(data);
    }
}
console.log(wires["a"]);