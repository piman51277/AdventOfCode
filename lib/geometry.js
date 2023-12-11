/**
 * Uses the shoelace theorem to calculate the area of a polygon
 * @param {[number, number]} points 
 */
function shoelaceTheorem(points) {
  var n = points.length;
  var area = 0;
  for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  return Math.abs(area / 2);
}

/**
 * Uses pick's theorem to calculate the number of points inside a lattice polygon
 * @param {[number, number]} points
 */
function picksTheorem(points) {
  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  var n = points.length;
  var area = shoelaceTheorem(points);
  var boundary = 0;
  for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    boundary += gcd(Math.abs(points[i][0] - points[j][0]), Math.abs(points[i][1] - points[j][1]));
  }
  return Math.round(area - boundary / 2 + 1);
}

/**
 * Checks if two line segments intersect
 * Note: This assumes a1.x <= a2.x and b1.x <= b2.x
 * @param {[number, number]} a1 - first point of first line segment
 * @param {[number, number]} a2 - second point of first line segment
 * @param {[number, number]} b1 - first point of second line segment
 * @param {[number, number]} b2 - second point of second line segment
 */
function lineSegmentsIntersect(a1, a2, b1, b2) {
  function ccw(a, b, c) {
    return (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);
  }

  return ccw(a1, b1, b2) !== ccw(a2, b1, b2) && ccw(a1, a2, b1) !== ccw(a1, a2, b2);
}

/**
 * Checks if a point is inside a polygon
 * @param {[number, number]} point 
 * @param {[number, number][]} polygon 
 */
function pointInPolygon(point, polygon) {
  var x = point[0],
    y = point[1];
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i][0],
      yi = polygon[i][1];
    var xj = polygon[j][0],
      yj = polygon[j][1];
    var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}