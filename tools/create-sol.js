#! /usr/bin/env node

const fs = require("fs");
const path = require("path");

//setup readline
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//question function
async function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

//y/n question function
async function confirm(query) {
  return new Promise((resolve) => {
    question(query).then((answer) => {
      resolve(answer.toLowerCase() === "y");
    });
  });
}

//helper func to get the input
async function getInput(year, day) {
  //get the cookies (located in config file .cookie)
  const configPath = path.join(__dirname, "..", ".cookie");
  const cookie = fs.readFileSync(configPath, "utf8");

  //check if cookie is there and valid
  if (!cookie) {
    console.log("No .cookie found, please create a .cookie file");
    process.exit(0);
  }

  const URL = `https://adventofcode.com/${year}/day/${day}/input`;

  //get the input
  const response = await fetch(URL, {
    headers: {
      cookie,
      "user-agent":
        "https://github.com/piman51277/AdventOfCode by piman.dev@gmail.com",
      "cache-control": "no-cache",
    },
  });

  //check if we got a 200
  if (response.status !== 200) {
    console.log("Invalid cookie, please check your .cookie file");
    process.exit(0);
  }

  //return the input
  return await response.text();
}

async function main() {
  //read in parameters
  const args = process.argv.slice(2);

  //read in the year and the day
  const year = parseInt(args[0]);
  const day = parseInt(args[1]);

  //check if the year and day are valid
  if (isNaN(year) || isNaN(day)) {
    console.log("Invalid year or day");
    process.exit(0);
  }

  //check if solution already exists
  const solutionPath = path.join(
    __dirname,
    "..",
    "solutions",
    year.toString(),
    day.toString()
  );

  //overwrite on request
  if (fs.existsSync(solutionPath)) {
    const doOverwrite = await confirm(
      "Solution already exists, overwrite? (y/n) "
    );

    if (!doOverwrite) {
      console.log("Aborting");
      process.exit(0);
    } else {
      console.log("Overwriting existing solution...");

      //delete the old solution
      fs.rmSync(solutionPath, { recursive: true });
    }
  }

  //create the solution directory
  fs.mkdirSync(solutionPath, { recursive: true });

  //create the two solution files

  //make the solution files
  const lines = `const fs = require("fs");\nconst input = fs.readFileSync("input.txt", "utf8").split("\\n");`;

  //create the part 1 solution file
  fs.writeFileSync(path.join(solutionPath, "index.js"), lines);

  //create the part 2 solution file
  fs.writeFileSync(path.join(solutionPath, "index2.js"), lines);

  //create the input file
  fs.writeFileSync(path.join(solutionPath, "input.txt"), "");

  console.log("Created solution template for day " + day + " of year " + year);

  //ask if we should grab the input as well
  const doGrabInput = await confirm("Grab input? (y/n) ");
  if (!doGrabInput) {
    console.log("Aborting");
    process.exit(0);
  }

  //get the input
  const input = await getInput(year, day);

  //write the input to the file
  fs.writeFileSync(path.join(solutionPath, "input.txt"), input);

  //close the readline interface, we don't need it anymore
  rl.close();
}

main();
