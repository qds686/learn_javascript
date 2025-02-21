// 关于内置类原型扩展方法
; (function () {
  // 检测num是否是合法数字
  const checkNum = num => {
    num = +num;
    return isNaN(num) ? 0 : num;
  };

  Number.prototype.plus = function plus(num) {
    num = checkNum(num);
    return this + Num;
  };

  Number.prototype.minus = function minus(num) {
    num = checkNum(num);
    return this - Num;
  };
})();

let n = 10;
let m = n.plus(10).minus(5);

console.log(m); //=>15 (10+10-5)