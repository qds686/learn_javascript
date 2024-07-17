/* 
  JS中的数据类型
    基本数据类型：
      + number
      + string
      + boolean
      + null
      + undefined
      + bigint
      + symbol
    引用数据类型：
      + 标准普通对象：普通对象 {}
      + 标准特殊对象：数组、正则、数学函数对象、日期对象、错误对象、Set、Map...
      + 非标准特殊对象：原始值对应的对象数据类型
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

/**
 * Number([value]) 把其他数据类型转换为number数据类型
 * "规则"
 * 	 + 字符串转换为数字：空字符串变为0，如果出现任何非有效数字字符，结果都是NaN
 * 	 + 把布尔转换为数字：true->1  false->0
 * 	 + null->0  undefined->NaN 
 * 	 + Symbol无法转换为数字，会报错：Uncaught TypeError: Cannot convert a Symbol value to a number
 *   + BigInt去除“n”（超过安全数字的，会按照科学计数法处理）
 * 
 *   + 引用数据类型转换为数字的调用步骤
 *     + 先调用对象的 Symbol.toPrimitive 这个属性
 *     + 如果没有这个属性，再调用对象的 valueOf 获取原始值
 *     + 如果没有原始值，再调用对象的 toString 把其变为字符串
 *       + [10,20].toString() -> '10,20'
 *       + ({}).toString() -> '[object Object]'
 *     + 最后再把字符串基于Number方法转换为数字
*/

console.log(Number(''));//0
console.log(Number('12.5px'));//NaN
console.log(isNaN('12px'));// true
console.log(Number(12.5.5));//NaN
console.log(Number('12.5'));//12.5

console.log(Number(true));//1
console.log(Number(false));//0
console.log(isNaN(false));//false

// {}/{xxx:'xxx'}.toString() =>'[object Object]'=>NaN 
// Number(NaN) => NaN
console.log(Number({ name: '10' }));//NaN
console.log(Number({}));//NaN
// [].toString() ->''
console.log(Number([]));//0
//[12].toString() -> '12'
console.log(Number(12));//12
//[12,13].toString() -> '12,13'
console.log(Number([12, 13]));//NaN 
[55].valueOf => [55] //不是原始值，原始值是基本数据类型

console.log(Number(Symbol(10))); // 报错
console.log(Number(BigInt(10))); // 10

/** 
 * "隐式转换方法"
 *  + parseInt([val])/parseFloat([val]) 把其他数据类型转换为数字类型
 *    + [val]值必须是一个字符串，如果不是则先转换为字符串
 *    + 然后从字符串左侧第一个字符开始找，把找到的有效数字字符最后转换为数字「一个都没找到就是NaN」
 *    + 遇到一个非有效数字字符，不论后面是否还有有效数字字符，都不再查找了；parseFloat可以多识别一个小数点
*/
let str = '12.5px';
console.log(Number(str));//NaN
console.log(parseInt(str));//12
console.log(parseFloat(str));//12.5
console.log(parseFloat('width:12.5px'));//NaN
console.log(parseInt(true));//NaN

/** 
 *  + parseInt([val],[radix])
 *    + 从[val]左侧开始进行查找，找到所有符合[radix]进制的内容，然后把其按照[radix]进制转换为10进制！！
 *    + [radix]是设置的进制，取值有效范围是2~36之间，如果不在有效范围内，结果就是NaN
 *    + [radix]不写或者设置的为0，默认就是10「特殊情况：如果[val]是以“0x”开始的，则默认值是16」
 *  + [number value].toFixed([n]): 保留小数点后面n位，最后的结果是一个字符串
 * 
*/

/**
 * 把一个任意进制值转化为十进制
 */

147（8进制） => 十进制
[位权值：每一位的权重，个位是0，十位是1...]
1 * 8 ^ 2 + 4 * 8 ^ 1 + 7 * 8 ^ 0

12.23(4) => 十进制
1 * 4 ^ 1 + 2 * 4 ^ 0 + 2 * 4 ^ -1 + 3 * 4 ^ -2

'0x629eb' -> 16进制 -> 0 - 9 a - f(10 - 15)
6 * 16 ^ 4 + 2 * 16 ^ 3 + 9 * 16 ^ 2 + 14 * 16 ^ 1 + 11 * 16 ^ 0 = 403947

  /**
   * 数字转换为相应进制的字符串数字 toString
   */
  (3).toString(2) -> 3作为10进制 -> 2进制（字符串）

var filterInt = function (value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;

  /**
   * parseInt有第二个参数转换进制
   */
  parseInt('0', 1) -> NaN(小于2或者大于36、未填写参数、字符串第一个字符不能被正常转换数字的情况)
  parseInt('10', 2) => 找符合01的
10 把它看做2进制，最后转化为10进制
1 * 2 ^ 1 + 0 * 2 ^ 0 = 2
parseInt('25', 3) => 找符合012的 ，不符合要求停止查找
2  当做3进制转化为10进制
2 * 3 ^ 0 => 2
parseInt('23', 4) => 找符合0123的
23 当做4进制转化为10进制
2 * 4 ^ 1 + 3 * 4 ^ 0 => 11

/**
 * map传参及循环次数
 */
let ary = [10, 20, 30];
ary = ary.map((item, index) => {
  // 循环遍历数组中的某一项就会触发回调函数(回调函数执行三次)
  // 每一次传递两个值:当前项和当前项的索引
  //   item=10  index=0 => 0
  //   item=20  index=1 => 20
  //   item=30  index=2 => 60
  return item * index;
});

/**
 * parseInt面试题
 */
let arr = [10.18, 0, 10, 25, 23];
arr = arr.map(parseInt);
console.log(arr);//[10,NaN,2,2,11]

// 把parseInt作为map回调函数，数组有五项，parseInt执行五次，每一次传递当前项和索引
parseInt(10.18, 0) -> parseInt(10.18, 10)
'10' -> 10
parseInt(0, 1)
NaN
parseInt(10, 2)
'10' -> 1 * 2 ^ 1 + 0 * 2 ^ 0 = 2
parseInt(25, 3)
'2' -> 2 * 3 ^ 0 = 2
parseInt(23, 4)
'23' -> 2 * 4 ^ 1 + 3 * 4 ^ 0 = 8 + 2 = 11


/**
 * => 把引用数据类型转换为数字场景：
 *   + 在“+加号”运算中，如果左右两边出现字符串或者是部分对象值则不是属性运算，会变为字符串拼接
 *   + 其余的数学运算“例如：- / * % ...”，会把对象转换为数字
 *   + “==”比较的时候，也会把对象转换为字符串或者数字 => 后面介绍
 *   + alert([value]) 把值隐式转换为字符串输出
 *   + 模板字符串实现的是字符串拼接，对象会转换为字符串
*/

/** 
* “+”除数学运算，还可能代表的字符串拼接
*   + 有两边，一边是字符串，肯定是字符串拼接
*   + 有两边，一边是对象(目的是把对象转换为数字，进行数学运算),则可能是字符串拼接，还有可能是数学运算
*     + 首先会获取对象的[Symbol.toPrimitive]或者valueOf
*     + 如果上述都没有获取原始值，则基于toString把对象转换为字符串
*     + 此时出现问题，“+左右两边，有一边出现字符串了”，此时就不再是数学运算，是字符串拼接
*   + 只出现在左边，这样这一边即使是字符串或者对象也是数学运算
*     + 例如：+"10" 这种方式就是把其它值转换为数字
*   + 如果是一个“{}”加内容，“{}”不参与运算，知识相当于一个代码块
*     + {}+10->10、({}+10)->'[object Object]10'
*   + 遇到 ++i 或者 i++ ，一定是把i的值变为数字进行累加的
*   + ...
* 
* 字符串有很多自己能够调用的方法
*  charAt/charCodeAt/substr/substring/slice/split/replace/indexOf/lastIndexOf/includes/trim/match...
*/
console.log(10 + '10'); // '1010' 字符串拼接
console.log(10 - '10'); // 0 数学运算

console.log(10 + [10, 20]);
/* 
[10, 20][Symbol.toPrimitive] -> undefined
[10, 20].valueOf() -> [10,20]不是原始值
[10, 20].toString() -> "10,20"
-----此时
10 + "10,20" 这是字符串拼接了 =>"1010,20"
*/

console.log(10 + {}); // "10[object Object]"
console.log(10 + new Number(10)); // 20
/*
  new Number(10)是一个对象
  new Number(10)[Symbol.toPrimitive] undefined
  new Number(10).valueOf() 10
  10+10 = 20
*/
