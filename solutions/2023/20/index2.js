const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const modulesArr = input.map(line => {
  let [name, outputs] = line.split(" -> ");
  let type = name == "broadcaster" ? "b" : (name[0] == "%" ? "f" : "c");
  let outs = outputs.split(", ");
  let state = false;
  let santiziedName = name.replace(/(%|&)/g, "");

  return { name: santiziedName, type, outs, state, seenStates: {} };
});

//add a module called rx
modulesArr.push({ name: "rx", type: "k", outs: [], state: false, seenStates: {} });


//remap to a map of name -> module
const modules = modulesArr.reduce((acc, module) => {
  acc[module.name] = module;
  return acc;
}, {});

//populate parentIDs
for (let module of modulesArr) {
  for (let out of module.outs) {
    //is it a type c?
    if (modules[out].type == "c") {
      modules[out].seenStates[module.name] = false;
    }
  }
}


//name pulse hi = 1, lo = 0
function iter() {
  const queue = [["broadcaster", 0, "button"]];
  let wasUpdated = [false, false, false, false]
  let updatedValues = [false, false, false, false]
  let index = ["nd", "pc", "vd", "tx"]

  for (let i = 0; i < queue.length; i++) {
    let [name, pulseType, from] = queue[i];

    //if the module name doesnt exist, skip it
    if (!modules[name]) continue;

    //process type
    if (modules[name].type == "f") {
      //is the pulse lo?
      if (pulseType == 0) {
        //flip the internal state
        modules[name].state = !modules[name].state;
        //pass along the signal
        for (let out of modules[name].outs) {
          queue.push([out, modules[name].state ? 1 : 0, name]);
        }
      }
    }

    //its of type c
    else if (modules[name].type == "c") {

      //is this hf?
      if (name == "hf") {
        //is we just updated this
        let saved = modules[name].seenStates[from] ? 1 : 0;
        if (saved != pulseType) {

          let ind = index.indexOf(from);
          wasUpdated[ind] = true;
          updatedValues[ind] = pulseType;
        }
      }


      //update the memory
      modules[name].seenStates[from] = pulseType;

      if (pulseType == 0) {
        //no need to recalc, just send a high
        modules[name].state = true;
        for (let out of modules[name].outs) {
          queue.push([out, 1, name]);
        }
        continue;
      }

      //check if every input is high
      let allHigh = true;
      for (let input in modules[name].seenStates) {
        if (modules[name].seenStates[input] == 0) {
          allHigh = false;
          break;
        }
      }

      //if all inputs are high, send a lo
      modules[name].state = !allHigh;
      if (allHigh) {
        for (let out of modules[name].outs) {
          queue.push([out, 0, name]);
        }
      } else {
        for (let out of modules[name].outs) {
          queue.push([out, 1, name]);
        }
      }
    }
    else if (modules[name].type == "b") {
      //just pass the signal along
      for (let out of modules[name].outs) {
        queue.push([out, pulseType, name]);
      }
    }

    //type k
    else {
      //if gets a lo pulse, set state to high
      if (pulseType == 0) {
        modules[name].state = true;
      }
    }
  }

  return [wasUpdated, updatedValues];
}

//run the simulation 1000 times
let first = [0, 0, 0, 0];
let cycle = [0, 0, 0, 0];
for (let i = 0; i < 10000; i++) {
  let [wasUpdated] = iter();


  for (let k = 0; k < 4; k++) {
    if (wasUpdated[k]) {
      if (first[k] == 0) {
        first[k] = i;
      }
      else if (cycle[k] == 0) {
        cycle[k] = i - first[k];
      }
    }
  }

  //if all cycles are found, stop
  if (cycle.every(x => x != 0)) {
    break;
  }

}

//lcm the cycles
function gcd(a, b) {
  return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

const lcm1 = lcm(cycle[0], cycle[1]);
const lcm2 = lcm(lcm1, cycle[2]);
const lcm3 = lcm(lcm2, cycle[3]);

console.log(lcm3);
