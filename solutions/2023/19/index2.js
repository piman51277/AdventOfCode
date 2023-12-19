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


/**
 * Template state
 * state = {
 * a:[max, min],
 * m:[max, min],
 * x:[max, min],
 * s:[max, min],
 * workflow: "id"
 * ruleID: 0
 * }'
 * max and min are inclusive
 */

let states = [{
  a: [4000, 1],
  m: [4000, 1],
  x: [4000, 1],
  s: [4000, 1],
  workflow: "in",
  ruleID: 0
}];

let ways = 0;

while (states.length > 0) {
  const state = states.pop();
  const { a, m, x, s, workflow, ruleID } = state;

  if (workflow == "A") {
    ways += (a[0] - a[1] + 1) * (m[0] - m[1] + 1) * (x[0] - x[1] + 1) * (s[0] - s[1] + 1);
    continue
  }
  else if (workflow == "R") {
    //its a jump to reject
    //do nothing
    continue
  }

  //get the workflow
  let rules = workflows[workflow];

  //get the rule
  let rule = rules[ruleID];
  let { cat, op, value, next } = rule;

  //what does this rule concern?

  //its a jump. 
  if (cat == "R") {
    if (next == "A") {
      ways += (a[0] - a[1] + 1) * (m[0] - m[1] + 1) * (x[0] - x[1] + 1) * (s[0] - s[1] + 1);
    }
    else if (next == "R") {
      //its a jump to reject
      //do nothing
    }
    else {
      //its a jump to another workflow
      //get the workflow
      //add the new state to the stack
      states.push({
        a: a,
        m: m,
        x: x,
        s: s,
        workflow: next,
        ruleID: 0
      });
    }
    continue;
  }

  //its a rule about a, m, x, or s
  let [max, min] = state[cat];

  //does the value land in the range?
  if (value > min && value < max) {

    //the range is split
    //add the new states to the stack
    const copyOne = structuredClone(state);
    copyOne[cat] = [max, value + 1];

    const copyTwo = structuredClone(state);
    copyTwo[cat] = [value - 1, min];

    if (op == ">") {
      //copyOne jumps to the next workflow
      copyOne.workflow = next;
      copyOne.ruleID = 0;
      states.push(copyOne);

      //copyTwo jumps to the next rule
      copyTwo.workflow = workflow;
      copyTwo.ruleID = ruleID + 1;
      copyTwo[cat][0] = value;
      states.push(copyTwo);
    }
    else if (op == "<") {
      //copyOne jumps to the next rule
      copyOne.workflow = workflow;
      copyOne.ruleID = ruleID + 1;
      copyOne[cat][1] = value;
      states.push(copyOne);

      //copyTwo jumps to the next workflow
      copyTwo.workflow = next;
      copyTwo.ruleID = 0;
      states.push(copyTwo);
    }

    continue;
  }

  if (value == min && op == ">") {
    //the range is not split
    //everyone jumps to the next workflow
    const copy = structuredClone(state);
    copy[cat] = [max, min];
    copy.workflow = next;
    copy.ruleID = 0;
    states.push(copy);

    continue;
  }

  if (value == max && op == "<") {
    //the range is not split
    //everyone jumps to the next workflow
    const copy = structuredClone(state);
    copy[cat] = [max, min];
    copy.workflow = next;
    copy.ruleID = 0;
    states.push(copy);
    continue;
  }

  //this condition is impossible to meet
  //reject
  continue;
}


console.log(ways);