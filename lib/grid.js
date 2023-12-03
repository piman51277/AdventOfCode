/**
 * Neightbor test for a grid
 * @param {number} x1 - x coordinate of the first cell
 * @param {number} y1 - y coordinate of the first cell
 */
function areNeighbors(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}

/**
 * Get the neighbors of a cell
 * @param {number} x - x coordinate of the cell
 * @param {number} y - y coordinate of the cell
 */
function getNeighbors(x, y) {
  var neighbors = [];
  for (var i = 0; i < grid.length; i++) {
    var cell = grid[i];
    if (Math.abs(cell.x - x) <= 1 && Math.abs(cell.y - y) <= 1) {
      neighbors.push(cell);
    }
  }
  return neighbors;
}

/**
 * Get all neighbors that meet a certain condition
 * @param {number} x - x coordinate of the cell
 * @param {number} y - y coordinate of the cell
 * @param {function} condition - function that returns true if the cell meets the condition
 */
function getNeighborsWithCondition(x, y, condition) {
  var neighbors = [];
  for (var i = 0; i < grid.length; i++) {
    var cell = grid[i];
    if (Math.abs(cell.x - x) <= 1 && Math.abs(cell.y - y) <= 1 && condition(cell)) {
      neighbors.push(cell);
    }
  }
  return neighbors;
}
