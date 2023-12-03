/**
 * Class for a 1D Bound
 * @param {number} x - left coordinate of the bound
 * @param {number} width - width of the bound
 */
class Bound1D {
  constructor(x, width) {
    this.x = x;
    this.width = width || 0;
  }

  /**
   * Checks if this bound collides with another bound (strong overlap)
   * @param {Bound1D} bound
   */
  doesCollide(bound) {
    return this.x < bound.x + bound.width &&
      this.x + this.width > bound.x;
  }

  /**
   * Checks if this bound collides with another bound (weak overlap)
   * @param {Bound1D} bound
   */
  doesCollideWeak(bound) {
    return this.x <= bound.x + bound.width &&
      this.x + this.width >= bound.x;
  }
}

/**
 * Gets a 1D bound that contains all the points in the array
 * @param {Array} points - array of points
 */
function getBound1DFromPoints(points) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  return new Bound1D(min, max - min);
}

/**
 * Gets a 2D bound that contains all the points in the array
 * @param {Array} points - array of points
 */
function getBound2DFromPoints(points) {
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  return new Bound2D(minX, minY, maxX - minX, maxY - minY);
}


/**
 * Class for a 2D Bound
 * @param {number} x - x coordinate of the top left corner
 * @param {number} y - y coordinate of the top left corner
 * @param {number} width - width of the box
 * @param {number} height - height of the box
*/
class Bound2D {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width || 0;
    this.height = height || 0;
  }

  /**
   * Checks if this bound collides with another bound (strong overlap)
   * @param {Bound2D} bound 
   * @returns 
   */
  doesCollide(bound) {
    return this.x < bound.x + bound.width &&
      this.x + this.width > bound.x &&
      this.y < bound.y + bound.height &&
      this.y + this.height > bound.y;
  }

  /**
   * Checks if this bound collides with another bound (weak overlap)
   * @param {Bound2D} bound 
   * @returns 
   */
  doesCollideWeak(bound) {
    return this.x <= bound.x + bound.width &&
      this.x + this.width >= bound.x &&
      this.y <= bound.y + bound.height &&
      this.y + this.height >= bound.y;
  }
}

