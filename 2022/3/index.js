const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let sum = 0;


for (const backpack of input) {
  
  //split into two strings of same length
  const first = backpack.slice(0, backpack.length / 2);
  const second = backpack.slice(backpack.length / 2);

  //find the character that is the same in both strings
  const same = first.split("").find((char, index) => second.includes(char));

  //map a-z A-Z to 1-52
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const number = alphabet.indexOf(same) + 1;

  console.log(same, number)

  sum += number;

}

console.log(sum);