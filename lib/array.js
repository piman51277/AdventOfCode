Array.prototype.countHits = function (value) {
  return this.filter(function (x) {
    return x === value;
  }).length;
};
