const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8")

const sections = input.split("\n\n");


//workflows
const workflowsArr = sections[0].split("\n").map(line => {
  let [id, rest] = line.split("{");
  rest = rest.slice(0, -1);
  let rules = rest.split(",").map(rule => rule.trim());
  rules = rules.map(rule => {

    const cond = rule.split(":");

    //does it include a < or a >?
    if (!(rule.includes("<") || rule.includes(">"))) {
      return { cat: "R", op: "|", value: 0, next: rule };
    }

    let cat = cond[0][0];
    let op = cond[0][1];
    let value = parseInt(cond[0].slice(2, cond[0].length));
    return { cat, op, value, next: cond[1] };
  })

  return { id, rules };
})

//remake into object with id as key
const workflows = {};

workflowsArr.forEach(workflow => {
  workflows[workflow.id] = workflow.rules;
});


const parts = sections[1].split("\n").map(line => {
  if (line === "") return;

  //JSON parse the line
  line = line.replace("x", "\"x\"").replace("m", "\"m\"").replace("a", "\"a\"").replace("s", "\"s\"")
  line = line.replace(/=/g, ":");

  return JSON.parse(line);
})

parts.pop();


function processPart(part) {
  //get the first workflow
  let workflow = workflows["in"];
  while (true) {
    //start looping through the workflow
    for (const rule of workflow) {
      const { cat, op, value, next } = rule;

      if (cat == "R") {
        if (next == "R" || next == "A") {
          return next == "A";
        }
        workflow = workflows[next];
        break;
      }

      if (eval(`${part[cat]} ${op} ${value}`)) {
        if (next == "R" || next == "A") {
          return next == "A";
        }
        workflow = workflows[next];
        break;
      }
    }
  }
}

let sum = 0;
for (const part of parts) {
  if (processPart(part)) {
    sum += part.x + part.m + part.a + part.s;
  }
}
console.log(sum);