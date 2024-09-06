/* 
  JS中的数据类型
    原始值类型（值类型/基本数据类型）：
      + number 数字
      + string 字符串
      + boolean 布尔
      + null 空对象指针
      + undefined 未定义
      + bigint 大数
      + symbol 唯一值
    对象类型（引用数据类型）：
      + 标准普通对象：普通对象object {}
      + 标准特殊对象：数组(new Array)、正则、数学函数对象、日期对象、错误对象、Set、Map...
      + 非标准特殊对象：原始值对应的对象数据类型 new Number()/new String()/...
      + 函数对象function
*/
// =============================================================

/**
 * number数字类型：
 * 	 + 正数、负数、0、小数
 * 	 + Infinity 代指无穷大的数
 *   + NaN：not a number 不是一个有效数字
 * 		 + NaN属于number类型，是一个数值，表示非有效数字
 * 		 + NaN与任何数进行运算都是NaN
 * 		 + NaN与任何数都不相等，包括自己
 *   + isNaN(隐式转换)
 * 		 + 检测一个值是否为非有效数字，如果不是有效数字返回true，反之是有效数字返回false
 * 		 + 在使用isNaN进行检测的时候，首先会验证检测的值是否为数字类型，如果不是，先基于Number()这个方法，把值转换为数字类型，然后再检测
 *   + [number value].toFixed() 保留小数点后面N位（最后 的结果是一个字符串）
 */

// 1.Number类型的基本使用
var age = 18;
var height = 1.88;
// 2.特殊的值
var num1 = Infinity;
var num2 = 1 / 0; // infinity

var result = 3 * "abc";
console.log(result); // NaN
console.log(NaN === NaN); // false
console.log(isNaN(result)); // true

// 3.进制表示
var num3 = 100 // 十进制
var num4 = 0x100 // 十六进制
var num5 = 0o100 //八进制
var num6 = 0b100 // 二进制
console.log(num3, num4, num5, num6);// 100 256 64 4

// 4.数字可以表示的范围
var max = Number.MAX_SAFE_INTEGER // 0-2^53-1
var min = Number.MIN_SAFE_INTEGER
console.log(max, min);// 9007199254740991 -9007199254740991

// 5.tofixed
var a = 3.1415;
var result = a.toFixed(2); // 3.14