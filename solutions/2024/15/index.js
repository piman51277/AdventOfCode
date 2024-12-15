const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").trim().split("\n");
const grid = input.map((line) => line.split(""));
const height = grid.length;
const width = grid[0].length;

console.log(grid);

/**
 * Get the value of all neighbors that meet a certain condition
 * X is COL #, Y is ROW #
 * @param {number} x - x coordinate of the cell
 * @param {number} y - y coordinate of the cell
 * @param {(x, y, value) => bool} condition - function that returns true if the cell meets the condition
 */
function getNeighborsValueWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y, grid[y][x - 1]] : null,
    x < grid[0].length - 1 ? [x + 1, y, grid[y][x + 1]] : null,
    y > 0 ? [x, y - 1, grid[y - 1][x]] : null,
    y < grid.length - 1 ? [x, y + 1, grid[y + 1][x]] : null,
    //diag
    x > 0 && y > 0 ? [x - 1, y - 1, grid[y - 1][x - 1]] : null,
    x > 0 && y < grid.length - 1 ? [x - 1, y + 1, grid[y + 1][x - 1]] : null,
    x < grid[0].length - 1 && y > 0 ? [x + 1, y - 1, grid[y - 1][x + 1]] : null,
    x < grid[0].length - 1 && y < grid.length - 1
      ? [x + 1, y + 1, grid[y + 1][x + 1]]
      : null,
  ];
  return neighbors
    .filter((k) => k !== null && condition(k[0], k[1], k[2]))
    .map((k) => k[2]);
}

console.log(
  getNeighborsValueWithCondition(0, 14, (x, y, value) => value == "1")
);
