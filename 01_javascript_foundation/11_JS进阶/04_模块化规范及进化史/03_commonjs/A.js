let name = "盒子";
const sum = function sum(...params) {
  let len = params.length;
  if (len === 0) return 0;
  if (len === 1) return +params[0];
  let result = params.reduce((res, item) => +res + (+item));
  return result;
};

module.exports = {
  sum
};