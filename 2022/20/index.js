const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n").map(Number);

let working = input.map((n, i) => [n, i]);
for (let i = 0; i < input.length; i++) {
  //find the next number to process
  const current = working.find(([n, k]) => k === i);
  const [value] = current;
  const currentPosition = working.indexOf(current);
  const targetPosition = currentPosition + value;


  //if we are moving right
  if (value > 0) {
    //and not using wrapping
    if (currentPosition + value < input.length) {
      //remove the current number from the working array
      working.splice(currentPosition, 1);

      //add the current number to the target position
      working.splice(targetPosition, 0, current);
    }

    //and is using wrapping
    if (currentPosition + value >= input.length) {
      //figure out the final position
      const finalPosition = (currentPosition + value) % (input.length - 1);

      //remove the current number from the working array
      working.splice(currentPosition, 1);

      //add the current number to the final position
      working.splice(finalPosition, 0, current);
    }
  }

  //if we are moving left
  if (value < 0) {
    //and not using wrapping
    if (currentPosition + value > 0) {
      //remove the current number from the working array
      working.splice(currentPosition, 1);

      //add the current number to the target position
      working.splice(targetPosition, 0, current);
    }

    //and is using wrapping
    if (currentPosition + value <= 0) {
      //figure out the final positions
      const finalPosition = (currentPosition + value) % (input.length - 1);

      //remove the current number from the working array
      working.splice(currentPosition, 1);

      //add the current number to the final position
      working.splice(finalPosition, 0, current);
    }
  }
}

//get the position of the number 0
const zeroPosition = working.findIndex(([n, k]) => n === 0);

console.log(zeroPosition);

const coordinate1 = (zeroPosition + 1000) % input.length;
const coordinate2 = (zeroPosition + 2000) % input.length;
const coordinate3 = (zeroPosition + 3000) % input.length;

console.log(
  working[coordinate1][0],
  working[coordinate2][0],
  working[coordinate3][0]
);

console.log(
  working[coordinate1][0] + working[coordinate2][0] + working[coordinate3][0]
);
