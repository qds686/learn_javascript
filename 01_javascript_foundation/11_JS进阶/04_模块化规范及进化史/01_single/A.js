let AModule = (function () {
  let name = "盒子";
  const sum = function sum(...params) {
    let len = params.length;
    if (len === 0) return 0;
    if (len === 1) return +params[0];
    let result = params.reduce((res, item) => +res + (+item));
    return result;
  };

  // window.sum = sum;
  return {
    sum
  };
})();

// let r = sum(10, 20, 30, 40, 50);
// console.log(r); //150


// 面试题：重写reduce方法
/* 
Array.prototype.myReduce = function (callback, initialValue) {
  var self = this,
    result = initialValue,
    index = 0;
  if (typeof callback !== 'function') throw new Error("callback is not a function");
  if (initialValue === undefined) {
    result = self[0];
    index = 1;
  }
  for (; index < self.length; index++) {
    result = callback(result, self[index], index);
  }
  return result;
}
let arr = [10, 20, 30, 40];
let result1 = arr.myReduce((x, item) => x + item);
let result2 = arr.myReduce((x, item) => x + item, 1);
// console.log(result1, result2); // 100 101
*/

