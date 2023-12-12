const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const pairs = input.map((line) => line.split(" "));



let ways = 0;
for (let pair of pairs) {
  let [springstr, lengs] = pair;

  springstr = (springstr + "?").repeat(5).slice(0, -1);
  const desiredlengs = Array.from({ length: 5 }, () => lengs.split(",").map(Number)).flat();

  //go ahead and take out all multiple ... into 1
  springstr = springstr.replace(/\.{2,}/g, ".");
  springstr = springstr.replace(/^\.|\.+$/g, "");

  const cache = {};
  function findWays(lenID, strpos, posInLen) {
    if (cache[`${lenID},${strpos},${posInLen}`] !== undefined) {
      return cache[`${lenID},${strpos},${posInLen}`];
    }
    const currentLen = desiredlengs[lenID];
    if (posInLen > currentLen || strpos > springstr.length) {
      return 0;
    }
    if (lenID === desiredlengs.length - 1 && posInLen === currentLen) {
      //are there any more #s?
      if (springstr.slice(strpos).includes("#")) {
        return 0;
      }
      return 1;
    }
    //is it a #?
    let total = 0;
    if (springstr[strpos] === "#") {
      total += findWays(lenID, strpos + 1, posInLen + 1);
    }
    //is it a .?
    if (springstr[strpos] === ".") {
      //have we finished this chunk yet?
      if (posInLen === currentLen) {
        //we have finished this chunk, so we can move on to the next one
        total += findWays(lenID + 1, strpos + 1, 0);
      }
      else if (posInLen == 0) {
        //dump the current progress and start over
        total += findWays(lenID, strpos + 1, 0);
      }
    }
    //is it a ?
    if (springstr[strpos] === "?") {
      //we can do either
      total += findWays(lenID, strpos + 1, posInLen + 1);
      if (posInLen === currentLen) {
        //we have finished this chunk, so we can move on to the next one
        total += findWays(lenID + 1, strpos + 1, 0);
      }
      else if (posInLen == 0) {
        //dump the current progress and start over
        total += findWays(lenID, strpos + 1, 0);
      }
    }

    cache[`${lenID},${strpos},${posInLen}`] = total;

    return total;
  }


  let k = (findWays(0, 0, 0));

  ways += k;
}

console.log(ways);