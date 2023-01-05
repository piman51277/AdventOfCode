const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const directories = {};
let currentPath = ["/"];

for (let i = 0; i < input.length; i++) {
  const line = input[i];

  //if line is a command
  if (line.includes("$")) {
    //if the command is cd
    if (line.includes("cd")) {
      const dir = line.split(" ")[2];

      if (dir === "..") {
        currentPath.pop();
      } else if (dir === "/") {
        currentPath = ["/"];
      } else {
        currentPath.push(dir);
      }
    } else {
      //command is ls
      const entries = [];

      //look ahead for ls output
      for (let j = i + 1; j < input.length; j++) {
        const nextLine = input[j];

        if (nextLine.includes("$")) {
          break;
        }

        entries.push(nextLine);
      }

      //parse entries
      const parsed = entries.map((entry) => {
        const [t1, name] = entry.split(" ");

        if (t1 === "dir") {
          return {
            name,
            type: "dir",
            size: 0,
          };
        } else {
          return {
            name,
            type: "file",
            size: parseInt(t1),
          };
        }
      });

      //add to directories
      directories[currentPath.join("-")] = parsed;
    }
  }
}

function getDirectorySize(name) {
  const dir = directories[name];
  let size = 0;

  let stack = [[dir, name]];

  //BFS
  while (stack.length > 0) {
    const [current, currentName] = stack.shift();

    for (let i = 0; i < current.length; i++) {
      const entry = current[i];

      if (entry.type === "file") {
        size += entry.size;
      } else {
        stack.push([
          directories[currentName + "-" + entry.name],
          currentName + "-" + entry.name,
        ]);
      }
    }
  }

  return size;
}

//get size of all directories
const sizes = Object.keys(directories).map((key) => {
  const val = getDirectorySize(key);
  return val;
});

const totalSize = getDirectorySize("/");

const neededDelete = totalSize - 40000000;

//get the smallest size over neededDelete
const smallestSize = sizes
  .sort((a, b) => a - b)
  .find((size) => size > neededDelete);

console.log(smallestSize);
