// JS中关于小数(浮点数)的计算会出现精准度丢失的问题
//   + JS中所有的值都是以2进制在计算机底层进行存储的
//   + 浮点数转为二进制，可能出现无限循环的情况
//   + 在计算机底层存储的时候，最多存储64位，舍弃了一些值，值本身就失去了精准度

// 浮点数计算的解决方案：
// 1.toFixed保留小数点后面N位，它自己会四舍五入
// console.log((0.1 + 0.2).toFixed(2)); // 0.30

// 2.扩大系数法
// 获取系数
const coefficient = function coefficient(num) {
  num = num + '';
  let [, char = ''] = num.split('.'),
    len = char.length;
  return Math.pow(10, len);
}
// 求和
const plus = function plus(num1, num2) {
  num1 = +num1;
  num2 = +num2;
  // 其中有一个不是有效数字，返回NaN
  if (isNaN(num1) || isNaN(num2)) return NaN;
  let max = Math.max(coefficient(num1), coefficient(num2));

  return result = (num1 * max + num2 * max) / max;
};
// let res1 = plus(0.1, 0.2);
// console.log(res1); // 0.3

// let res2 = plus(0.1, 0.25);
// console.log(res2); // 0.35

