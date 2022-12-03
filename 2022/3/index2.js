const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

let sum = 0;

for (let minbackpack = 0; minbackpack < input.length; minbackpack+=3) {

  const backpacks = input.slice(minbackpack, minbackpack + 3);

  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  //find letter that appears in all three backpacks
  const same = alphabet.split("").find((char) => {
    return backpacks.every((backpack) => backpack.includes(char));
  });

  const number = alphabet.indexOf(same) + 1;

  sum += number;
}

console.log(sum);
