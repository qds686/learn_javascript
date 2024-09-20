const A = require('./A');
let name = "hezi";
const average = function average(...params) {
  let len = params.length,
    total = A.sum(...params);
  if (len === 0) return 0;
  return (total / len).toFixed(2);
};

module.exports = {
  average
};