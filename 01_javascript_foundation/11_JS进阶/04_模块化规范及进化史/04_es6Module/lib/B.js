import sum from './A.js';
let name = "hezi";
export const average = function average(...params) {
  let len = params.length,
    total = sum(...params);
  if (len === 0) return 0;
  return (total / len).toFixed(2);
};

// export default average;

