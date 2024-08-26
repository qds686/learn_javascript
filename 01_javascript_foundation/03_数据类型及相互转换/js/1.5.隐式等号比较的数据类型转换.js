/**
 * ==：相等，相当于“绝对相等”，浏览器如果发现两边类型不一样，会进行“隐式转换”，转换为相同的类型再进行比较
 *   + NaN == NaN：不相等 NaN和任何值都不相等
 *   + null == undefined 相等，三个等号不相等，null/undefined和其他任何值都不相等
 *   + 字符串==对象：把对象转换为字符串
 *   + 剩余的两边数据类型不一样的情况，都是按照“转换为数字”再进行比较的规则处理
 * ===：绝对相等（推荐），要求两边的数据类型和值都要相等，只要有一个不相等，结果都是false（不存在数据类型的隐式转换）
 */
// console.log(NaN == NaN); // false
// console.log(null == undefined); // true
// console.log(null === undefined); // false
// console.log("10" == [10]); // true [10]->"10"

// 需求：验证obj是否为一个对象
var obj = {};

var isObj = function isObj(obj){
  var type = typeof obj;
  retrun obj !== null && type === 'object';
}
var result = isObj(obj);
console.log(result); // true
