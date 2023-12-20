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

//remap to a map of name -> module
const modules = modulesArr.reduce((acc, module) => {
  acc[module.name] = module;
  return acc;
}, {});

//populate parentIDs
for (let module of modulesArr) {
  for (let out of module.outs) {

    //if the module name doesnt exist, skip it
    if (!modules[out]) continue;

    //is it a type c?
    if (modules[out].type == "c") {
      modules[out].seenStates[module.name] = false;
    }
  }
}


//name pulse hi = 1, lo = 0
function iter() {
  let lopulse = 1;
  let highpulse = 0;

  const queue = [["broadcaster", 0, "button"]];

  for (let i = 0; i < queue.length; i++) {
    let [name, pulseType, from] = queue[i];

    //if the module name doesnt exist, skip it
    if (!modules[name]) continue;

    //process type
    if (modules[name].type == "b") {
      if (pulseType == 0) {
        lopulse += modules[name].outs.length;
      }
      else {
        highpulse += modules[name].outs.length;
      }

      //just pass the signal along
      for (let out of modules[name].outs) {
        queue.push([out, pulseType, name]);
      }
    }
    else if (modules[name].type == "f") {
      //is the pulse lo?
      if (pulseType == 0) {
        //flip the internal state
        modules[name].state = !modules[name].state;
        if (modules[name].state) {
          //hi
          highpulse += modules[name].outs.length;
        }
        else {
          //lo
          lopulse += modules[name].outs.length;
        }

        //pass along the signal
        for (let out of modules[name].outs) {
          queue.push([out, modules[name].state ? 1 : 0, name]);
        }
      }
    }
    //its of type c
    else {
      //update the memory
      modules[name].seenStates[from] = pulseType;

      if (pulseType == 0) {
        highpulse += modules[name].outs.length;

        //no need to recalc, just send a high
        for (let out of modules[name].outs) {
          queue.push([out, 1, name]);
        }
        continue;
      }

      //TODO: optimize this by storing the last check result

      //check if every input is high
      let allHigh = true;
      for (let input in modules[name].seenStates) {
        if (modules[name].seenStates[input] == 0) {
          allHigh = false;
          break;
        }
      }

      //if all inputs are high, send a lo
      if (allHigh) {
        lopulse += modules[name].outs.length;

        for (let out of modules[name].outs) {
          queue.push([out, 0, name]);
        }
      } else {
        highpulse += modules[name].outs.length;

        for (let out of modules[name].outs) {
          queue.push([out, 1, name]);
        }
      }
    }
  }

  return [lopulse, highpulse]
}

//run the simulation 1000 times

let losum = 0, hisum = 0;
for (let i = 0; i < 1000; i++) {
  let [lo, high] = iter();
  console.log("iter", i, lo, high);
  losum += lo;
  hisum += high;
}
console.log("final", losum, hisum);
console.log(losum * hisum);
