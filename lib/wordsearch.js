class WordSearch {
  constructor(grid) {
    this.grid = grid;
  }

  /**
   * Checks if a word is in the grid
   * @param {string} word
   * @param {number} x
   * @param {number} y
   * @param {number} dx
   * @param {number} dy
   * @returns
   */
  checkWordAt(word, x, y, dx, dy) {
    const height = this.grid.length;
    const width = this.grid[0].length;
    for (let i = 0; i < word.length; i++) {
      if (
        x < 0 ||
        x >= width ||
        y < 0 ||
        y >= height ||
        this.grid[y][x] !== word[i]
      ) {
        return false;
      }
      x += dx;
      y += dy;
    }
    return true;
  }

  /**
   * Returns the position of all instances of a word in the grid
   * @param {string} word
   * @returns {[number, number, number, number][]}
   */
  findWordInstances(word, orthSearch = true, diagSearch = true) {
    const height = this.grid.length;
    const width = this.grid[0].length;
    const result = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (orthSearch) {
          if (this.checkWordAt(word, x, y, 1, 0)) {
            result.push([x, y, x + word.length - 1, y]);
          }
          if (this.checkWordAt(word, x, y, 0, 1)) {
            result.push([x, y, x, y + word.length - 1]);
          }
          if (this.checkWordAt(word, x, y, -1, 0)) {
            result.push([x - word.length + 1, y, x, y]);
          }
          if (this.checkWordAt(word, x, y, 0, -1)) {
            result.push([x, y - word.length + 1, x, y]);
          }
        }
        if (diagSearch) {
          if (this.checkWordAt(word, x, y, 1, 1)) {
            result.push([x, y, x + word.length - 1, y + word.length - 1]);
          }
          if (this.checkWordAt(word, x, y, -1, 1)) {
            result.push([x - word.length + 1, y, x, y + word.length - 1]);
          }
          if (this.checkWordAt(word, x, y, 1, -1)) {
            result.push([x, y - word.length + 1, x + word.length - 1, y]);
          }
          if (this.checkWordAt(word, x, y, -1, -1)) {
            result.push([x - word.length + 1, y - word.length + 1, x, y]);
          }
        }
      }
    }
    return result;
  }
}
