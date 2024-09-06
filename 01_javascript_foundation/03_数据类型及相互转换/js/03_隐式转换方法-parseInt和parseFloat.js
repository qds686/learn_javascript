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
console.log(parseInt(null));// NaN

/** 
 *  + parseInt([val],[radix])
 *    + 从[val]左侧开始进行查找，找到所有符合[radix]进制的内容，然后把其按照[radix]进制转换为10进制！！
 *    + [radix]是设置的进制，取值有效范围是2~36之间，如果不在有效范围内，结果就是NaN
 *    + [radix]不写或者设置的为0，默认就是10「特殊情况：如果[val]是以“0x”开始的，则默认值是16」
 *  + [number value].toFixed([n]): 保留小数点后面n位，最后的结果是一个字符串
 * 
*/

/**
 * 把一个任意进制值转化为十进制 => “按权展开求和”
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

// JS中遇到以0开始的“数字”，会默认把其按照8进制转为10进制，然后再进行其他操作
parseInt(0013, 2);
/* 
1.0013先8进制转为10进制
  0*8^3+0*8^2+1*8^1+3*8^0 = 0+0+8+3=11
  => parseInt('11', 2)
2.找符合radix二进制的字符'11'，再二进制转为10进制
  1*2^1+1*2^0 = 2+1 = 3
*/