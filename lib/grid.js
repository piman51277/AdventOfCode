/**
 * Neightbor test for a grid
 * @param {number} x1 - x coordinate of the first cell
 * @param {number} y1 - y coordinate of the first cell
 */
function areNeighbors(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}

/**
 * Get the value of neighbors of a cell
 * @param {number} x - x coordinate of the cell
 * @param {number} y - y coordinate of the cell
 */
function getNeighborsValue(x, y) {
  var neighbors = [
    x > 0 ? grid[x - 1][y] : null,
    x < grid.length - 1 ? grid[x + 1][y] : null,
    y > 0 ? grid[x][y - 1] : null,
    y < grid[0].length - 1 ? grid[x][y + 1] : null,
    x > 0 && y > 0 ? grid[x - 1][y - 1] : null,
    x > 0 && y < grid[0].length - 1 ? grid[x - 1][y + 1] : null,
    x < grid.length - 1 && y > 0 ? grid[x + 1][y - 1] : null,
    x < grid.length - 1 && y < grid[0].length - 1 ? grid[x + 1][y + 1] : null
  ];
  return neighbors.filter(k => k !== null);
}

/**
 * Get the value of all neighbors that meet a certain condition
 * @param {number} x - x coordinate of the cell
 * @param {number} y - y coordinate of the cell
 * @param {(x, y, value) => bool} condition - function that returns true if the cell meets the condition
 */
function getNeighborsValueWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y, grid[y][x - 1]] : null,
    x < grid.length - 1 ? [x + 1, y, grid[y][x + 1]] : null,
    y > 0 ? [x, y - 1, grid[y - 1][x]] : null,
    y < grid[0].length - 1 ? [x, y + 1, grid[y + 1][x]] : null,
    //diag
    x > 0 && y > 0 ? [x - 1, y - 1, grid[y - 1][x - 1]] : null,
    x > 0 && y < grid[0].length - 1 ? [x - 1, y + 1, grid[y + 1][x - 1]] : null,
    x < grid.length - 1 && y > 0 ? [x + 1, y - 1, grid[y - 1][x + 1]] : null,
    x < grid.length - 1 && y < grid[0].length - 1 ? [x + 1, y + 1, grid[y + 1][x + 1]] : null
  ];
  return neighbors.filter(k => k !== null && condition(k[0], k[1], k[2])).map(k => k[2]);
}

/**
 * Get the location of neighbors of a cell
 * @param {number} x 
 * @param {number} y 
 */
function getNeighborsLocation(x, y) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y] : null,
    x < grid.length - 1 ? [x + 1, y] : null,
    y > 0 ? [x, y - 1] : null,
    y < grid[0].length - 1 ? [x, y + 1] : null,
    //diag
    x > 0 && y > 0 ? [x - 1, y - 1] : null,
    x > 0 && y < grid[0].length - 1 ? [x - 1, y + 1] : null,
    x < grid.length - 1 && y > 0 ? [x + 1, y - 1] : null,
    x < grid.length - 1 && y < grid[0].length - 1 ? [x + 1, y + 1] : null
  ];
  return neighbors.filter(k => k !== null);
}

/**
 * Get the location of all neighbors that meet a certain condition
 * @param {number} x
 * @param {number} y
 * @param {(x, y, value) => bool} condition - function that returns true if the cell meets the condition
 */
function getNeighborsLocationWithCondition(x, y, condition) {
  var neighbors = [
    //orth
    x > 0 ? [x - 1, y] : null,
    x < grid.length - 1 ? [x + 1, y] : null,
    y > 0 ? [x, y - 1] : null,
    y < grid[0].length - 1 ? [x, y + 1] : null,
    //diag
    x > 0 && y > 0 ? [x - 1, y - 1] : null,
    x > 0 && y < grid[0].length - 1 ? [x - 1, y + 1] : null,
    x < grid.length - 1 && y > 0 ? [x + 1, y - 1] : null,
    x < grid.length - 1 && y < grid[0].length - 1 ? [x + 1, y + 1] : null
  ];
  return neighbors.filter(k => k !== null && condition(k[0], k[1], grid[k[1]][k[0]]));
}

/**
 * Finds the taxi cab distance between two points
 * This is the shortest distance between two points on an unrestricted, unweighted, orthogonal grid
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns 
 */
function taxicab(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Rotates a grid 90 degrees clockwise
 * @param {any[][]} grid 
 * @returns 
 */
function rotateGridCW(grid) {
  var newGrid = [];
  for (var x = 0; x < grid[0].length; x++) {
    newGrid.push([]);
    for (var y = grid.length - 1; y >= 0; y--) {
      newGrid[x].push(grid[y][x]);
    }
  }
  return newGrid;
}

/**
 * Rotates a grid 90 degrees counter-clockwise
 * @param {any[][]} grid 
 * @returns 
 */
function rotateGridCCW(grid) {
  var newGrid = [];
  for (var x = grid[0].length - 1; x >= 0; x--) {
    newGrid.push([]);
    for (var y = 0; y < grid.length; y++) {
      newGrid[grid[0].length - 1 - x].push(grid[y][x]);
    }
  }
  return newGrid;
}