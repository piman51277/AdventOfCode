const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

const inRegion = new Set();
const regions = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    //check if this is in a region
    if (inRegion.has(`${x},${y}`)) {
      continue;
    }

    //start a new region
    const regionType = grid[y][x];
    const regionCells = new Set();

    //start bfs
    const queue = [[x, y]];
    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (regionCells.has(`${x},${y}`)) {
        continue;
      }
      regionCells.add(`${x},${y}`);
      inRegion.add(`${x},${y}`);

      //add neighbors to the queue
      const neighbors = [
        x > 0 ? [x - 1, y, grid[y][x - 1]] : null,
        x < grid.length - 1 ? [x + 1, y, grid[y][x + 1]] : null,
        y > 0 ? [x, y - 1, grid[y - 1][x]] : null,
        y < grid[0].length - 1 ? [x, y + 1, grid[y + 1][x]] : null,
      ].filter((neighbor) => neighbor && neighbor[2] === regionType);
      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }
    }

    regions.push({
      type: regionType,
      cells: regionCells,
    });
  }
}

let score = 0;
for (const region of regions) {
  if (region.type === undefined) {
    continue;
  }

  //get bounds for the region
  let xLower = Infinity;
  let xUpper = -Infinity;
  let yLower = Infinity;
  let yUpper = -Infinity;
  for (const cell of [...region.cells]) {
    const [x, y] = cell.split(",").map(Number);
    xLower = Math.min(x, xLower);
    xUpper = Math.max(x, xUpper);
    yLower = Math.min(y, yLower);
    yUpper = Math.max(y, yUpper);
  }

  let xdisplacement = xLower;
  let ydisplacement = yLower;

  //create a grid that is 2 bigger
  const regionGrid = Array.from({ length: yUpper - yLower + 7 }, () =>
    Array.from({ length: xUpper - xLower + 7 }, () => 0)
  );

  //place all points in the grid with displacement
  for (const cell of [...region.cells]) {
    const [x, y] = cell.split(",").map(Number);
    regionGrid[y - ydisplacement + 1][x - xdisplacement + 1] = 1;
  }

  const lines = [];

  //look for all points that touch a true cell
  let borderCount = 0;
  for (let y = 0; y < regionGrid.length; y++) {
    for (let x = 0; x < regionGrid[0].length; x++) {
      if (regionGrid[y][x] != 1) {
        continue;
      }

      const bottomRight =
        y < regionGrid.length - 1 &&
        x < regionGrid[0].length - 1 &&
        regionGrid[y + 1][x + 1] == 1;
      const bottomLeft =
        y < regionGrid.length - 1 && x > 0 && regionGrid[y + 1][x - 1] == 1;
      const topRight =
        y > 0 && x < regionGrid[0].length - 1 && regionGrid[y - 1][x + 1] == 1;
      const topLeft = y > 0 && x > 0 && regionGrid[y - 1][x - 1] == 1;

      const bothRight = bottomRight && topRight;
      const bothLeft = bottomLeft && topLeft;
      const bothTop = topLeft && topRight;
      const bothBottom = bottomLeft && bottomRight;

      //the top left corner of this cell, is x,y

      //is there a cell to the left?
      if (x > 0 && regionGrid[y][x - 1] == 0) {
        lines.push([
          x,
          y,
          x,
          y + 1,
          "v",
          bothLeft ? "xl" : topLeft ? "tl" : bottomLeft ? "bl" : "",
        ]); //left border
      }

      //is there a cell to the right?
      if (x < regionGrid[0].length - 1 && regionGrid[y][x + 1] == 0) {
        lines.push([
          x + 1,
          y,
          x + 1,
          y + 1,
          "v",
          bothRight ? "xr" : bottomRight ? "br" : topRight ? "tr" : "",
        ]); //right border
      }

      //is there a cell above?
      if (y > 0 && regionGrid[y - 1][x] == 0) {
        lines.push([
          x,
          y,
          x + 1,
          y,
          "h",
          bothTop ? "xt" : topLeft ? "tl" : topRight ? "tr" : "",
        ]); //top border
      }

      //is there a cell below?
      if (y < regionGrid.length - 1 && regionGrid[y + 1][x] == 0) {
        lines.push([
          x,
          y + 1,
          x + 1,
          y + 1,
          "h",
          bothBottom ? "xb" : bottomRight ? "br" : bottomLeft ? "bl" : "",
        ]); //bottom
      }
    }
  }

  //start grouping lines up
  const groups = [];
  for (const line of lines) {
    const [l_x1, l_y1, l_x2, l_y2, l_type, l_restrict] = line;

    let found = false;
    for (const group of groups) {
      //is it the same type and share an endpoint?
      let okGrp = false;
      for (const member of group) {
        const [m_x1, m_y1, m_x2, m_y2, m_type, m_restrict] = member;

        if (
          l_type === m_type &&
          ((l_x1 === m_x2 && l_y1 === m_y2) ||
            (l_x2 === m_x1 && l_y2 === m_y1) ||
            (l_x2 === m_x2 && l_y2 === m_y2) ||
            (l_x1 === m_x1 && l_y1 === m_y1))
        ) {
          //now check for additional restrictions

          const clashes = [
            ["tl", "br"],
            ["bl", "tr"],
            ["tl", "tr"],
            ["bl", "br"],
          ];
          //xl is bl and tl at the same time
          //xr is br and tr at the same time
          //xt is tl and tr at the same time
          //xb is bl and br at the same time
          const transform = {
            xl: ["bl", "tl"],
            xr: ["br", "tr"],
            xt: ["tl", "tr"],
            xb: ["bl", "br"],
            br: ["br"],
            bl: ["bl"],
            tl: ["tl"],
            tr: ["tr"],
          };

          if (l_restrict && m_restrict) {
            let does_clash = false;
            for (const clash of clashes) {
              //if either is an x-type it's a clash
              if (l_restrict.includes("x") || m_restrict.includes("x")) {
                does_clash = true;
                break;
              }

              if (
                (transform[l_restrict].includes(clash[0]) &&
                  transform[m_restrict].includes(clash[1])) ||
                (transform[l_restrict].includes(clash[1]) &&
                  transform[m_restrict].includes(clash[0]))
              ) {
                console.log("CLASH INVESTIGATION");
                console.log(line);
                console.log(member);

                const l_rt = transform[l_restrict];
                const m_rt = transform[m_restrict];

                //okay, we found a clash, investgate
                if (l_type === "h") {
                  //get the corresponding points
                  let l_p = {};

                  if (
                    l_rt[0].includes("l") ||
                    (l_rt.length > 1 && l_rt[1].includes("l"))
                  ) {
                    l_p = { x: l_x1, y: l_y1 };
                  } else {
                    l_p = { x: l_x2, y: l_y2 };
                  }

                  let m_p = {};
                  if (
                    m_rt[0].includes("l") ||
                    (m_rt.length > 1 && m_rt[1].includes("l"))
                  ) {
                    m_p = { x: m_x1, y: m_y1 };
                  } else {
                    m_p = { x: m_x2, y: m_y2 };
                  }

                  //if the points are the same it's a clash
                  if (l_p.x === m_p.x && l_p.y === m_p.y) {
                    does_clash = true;
                    console.log("CLASH");
                    break;
                  }
                } else {
                  //get the corresponding points
                  let l_p = {};

                  if (
                    l_rt[0].includes("t") ||
                    (l_rt.length > 1 && l_rt[1].includes("t"))
                  ) {
                    l_p = { x: l_x1, y: l_y1 };
                  } else {
                    l_p = { x: l_x2, y: l_y2 };
                  }

                  let m_p = {};
                  if (
                    m_rt[0].includes("t") ||
                    (m_rt.length > 1 && m_rt[1].includes("t"))
                  ) {
                    m_p = { x: m_x1, y: m_y1 };
                  } else {
                    m_p = { x: m_x2, y: m_y2 };
                  }

                  //if the points are the same it's a clash
                  if (l_p.x === m_p.x && l_p.y === m_p.y) {
                    does_clash = true;
                    console.log("CLASH");
                    break;
                  }
                }
                console.log("NO CLASH");
              }
            }

            if (does_clash) {
              okGrp = false;
              break;
            }
          }

          okGrp = true;
          break;
        }
      }

      if (okGrp) {
        group.push(line);
        found = true;
        break;
      }
    }

    if (!found) {
      groups.push([line]);
    }
  }

  //print out the grid
  for (let y = 0; y < regionGrid.length; y++) {
    console.log(regionGrid[y].map((cell) => cell).join(""));
  }
  console.log(groups);

  console.log(region.type, groups.length, region.cells.size);
  score += groups.length * region.cells.size;
}

console.log(score);
