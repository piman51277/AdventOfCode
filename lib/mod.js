/**
 * Computes the a % n correctly for negative numbers
 * @param {number} a
 * @param {number} n
 * @returns
 */
function mod_safe(a, n) {
  return ((a % n) + n) % n;
}

let cache = {};
function mod_inverse(a, m) {
  if (cache[a] && cache[a][m]) return cache[a][m];
  a = mod_safe(a, m);
  for (var x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      if (!cache[a]) cache[a] = {};
      cache[a][m] = x;
      return x;
    }
  }
  if (!cache[a]) cache[a] = {};
  cache[a][m] = -1;
  return 1;
}

/**
 * Compute the Chinese Remainder Theorem
 * @param {[number, number][]} residues - array of [remainder, mod] pairs
 */
function CRT(residues) {
  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  //check if pairwise coprime
  for (var i = 0; i < residues.length; i++) {
    for (var j = i + 1; j < residues.length; j++) {
      if (gcd(residues[i][1], residues[j][1]) !== 1) {
        throw new Error("CRT: Residues are not pairwise coprime!!!");
      }
    }
  }

  var N = residues.reduce((acc, cur) => acc * cur[1], 1);
  return (
    residues.reduce((acc, cur) => {
      var n = N / cur[1];
      return acc + cur[0] * mod_inverse(n, cur[1]) * n;
    }, 0) % N
  );
}

console.log(
  CRT([
    [2, 10],
    [3, 5],
    [2, 7],
  ])
); // 23
