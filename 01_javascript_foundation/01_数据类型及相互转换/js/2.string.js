/**
 * 字符串数据类型
 *   + 双引号"" / 单引号'' / 反引号`` 包起来的都是字符串
 *   + 一个字符串是由0-多个字符组成的，每一个字符都有自己的位置“索引”，有一个length存储字符串长度
 */

/**
 * String([value])/ val.toString()把其他数据类型转换为string数据类型
 * + NaN.toString() -> NaN
 * + 数组转换为字符串，是把数组中的每一项用逗号分隔
 * + 普通对象.toString()的结果是 "[object Object]"
 * "对象转字符串规则"：
 *    + String(对象)：按照 先找Symbol.toPrimitive -> 再看valueOf -> 最后toString来处理
 *    + 对象.toString()：直接转换为字符串
 *    + 特殊：Object.prototype.toString是用来检测数据类型的
 *    + 基于alert/confirm/prompt/document.write...这些方法输出内容，都是把内容先转换为字符串，然后再输出的
 */

// null 和 undefined报错:
// null 和 undefined是进制直接toString的
(null).toString(); //报错
(undefined).toString(); //报错

// null和undefined可以转换为字符串
String(null);//'null'
String(undefined);//'undefined'
String(Symbol());// 'Symbol()'

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
