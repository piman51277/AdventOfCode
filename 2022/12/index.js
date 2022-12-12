//Base A* code from https://medium.com/codesphere-cloud/pathfinding-with-javascript-the-a-algorithm-263c23f344ac

const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");

const inputGrid = input.map((row) => row.split(""));

const alphabet = "abcdefghijklmnopqrstuvwxyzES";

let cols = inputGrid[0].length; //columns in the grid
let rows = inputGrid.length; //rows in the grid

let grid = []; //2D array containing all the grid points

let openSet = []; //array containing unevaluated grid points
let closedSet = []; //array containing completely evaluated grid points

let start; //starting grid point
let end; // ending grid point (goal)
let path = [];

//heuristic we will be using - Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function heuristic(position0, position1) {
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y, value) {
  this.x = x; //x location of the grid point
  this.y = y; //y location of the grid point
  this.f = 0; //total cost function
  this.g = 0; //cost function from start to the current grid point
  this.h = 0; //heuristic estimated cost function from current grid point to the goal
  this.neighbors = []; // neighbors of the current grid point
  this.parent = undefined; // immediate source of the current grid point
  this.value = value || 1000;

  // update neighbors array for a given grid point
  this.updateNeighbors = function (grid) {
    let i = this.x;
    let j = this.y;

    const current = grid[i][j];

    //the neighboring grid point can be at most 1 above in value
    if (i < cols - 1) {
      if (
        alphabet.indexOf(grid[i + 1][j].value) <=
        alphabet.indexOf(current.value) + 1
      ) {
        this.neighbors.push(grid[i + 1][j]);
      }
    }
    if (i > 0) {
      if (
        alphabet.indexOf(grid[i - 1][j].value) <=
        alphabet.indexOf(current.value) + 1
      ) {
        this.neighbors.push(grid[i - 1][j]);
      }
    }
    if (j < rows - 1) {
      if (
        alphabet.indexOf(grid[i][j + 1].value) <=
        alphabet.indexOf(current.value) + 1
      ) {
        this.neighbors.push(grid[i][j + 1]);
      }
    }

    if (j > 0) {
      if (
        alphabet.indexOf(grid[i][j - 1].value) <=
        alphabet.indexOf(current.value) + 1
      ) {
        this.neighbors.push(grid[i][j - 1]);
      }
    }
  };
}

//initializing the grid
function init() {
  //making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new GridPoint(i, j, inputGrid[j][i]);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateNeighbors(grid);
    }
  }

  //find the position of the S char
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].value == "S") {
        start = grid[i][j];
      }
    }
  }

  //find the position of the E char
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].value == "E") {
        end = grid[i][j];
      }
    }
  }

  openSet.push(start);
}

//A star search implementation

function search() {
  init();
  while (openSet.length > 0) {
    //assumption lowest index is the first one to begin with
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = openSet[lowestIndex];

    if (current === end) {
      let temp = current;
      path.push(temp);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }
      console.log("DONE!");
      // return the traced path
      return path.reverse();
    }

    //remove current from openSet
    openSet.splice(lowestIndex, 1);
    //add current to closedSet
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  //no solution by default
  console.log("No solution");
  return [];
}

const pathw = search();
console.log(pathw.length - 1);
