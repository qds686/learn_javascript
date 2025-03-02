/**
 * ==：相等，相当于“绝对相等”，浏览器如果发现两边类型不一样，会进行“隐式转换”，转换为相同的类型再进行比较
 *   + NaN == NaN：不相等，NaN和任何值(包含本身)都不相等，Object.is(NaN,NaN)=>true
 *   + null == undefined 相等，三个等号不相等，null/undefined和其他任何值都不相等
 *   + 字符串==对象：把对象转换为字符串 Symbol.toPrimitive -> valueOf -> toString
 *   + 对象 == 对象：比较的是内存地址，地址相同则相等
 *   + 剩余的两边数据类型不一样的情况，都是按照“转换为数字”再进行比较的规则处理
 * ===：绝对相等（推荐），要求两边的数据类型和值都要相等，只要有一个不相等，结果都是false（不存在数据类型的隐式转换）
 * Object.is([val1],[val2]) 检测两个值是否相等「ES6新增的」
 *   + 核心用的是“===”
 *   + 特殊：Object.is(NaN,NaN) => true
 */
// console.log(NaN == NaN); // false
// console.log(null == undefined); // true
// console.log(null === undefined); // false
// console.log("10" == [10]); // true [10]->"10"

// 需求：验证obj是否为一个对象
/* 
var obj = {};

var isObj = function isObj(obj) {
  var type = typeof obj;
  retrun obj !== null && type === 'object';
}
var result = isObj(obj);
console.log(result); // true 
*/

// 装箱和拆箱
let num = 10;
num.xx = 11;
console.log(num.toFixed(2)); // 10.00
console.log(num.xx); // undefined
// num是原始值，不是对象，是不能做“成员访问”
// 默认装箱操作：new Number(num) 变为非标准特殊对象(包装类型)，这样就可以调用 toFixed

console.log(10 + new Number(10)); // 20
// 在操作的过程中，浏览器会把num这个非标准特殊对象变为原始值，通过Symbol.toprimitive->valueOf->toString->Number，这个操作叫做拆箱

// =======
var name = 'javascript';
name += 10;
var type = typeof (name); // 'string'
if(type.length === 6){ // 读取length属性，JavaScript内部对其默认装箱，使得原始类型具有String中的属性和方法
  //=> new String(type).text = 'string'
  // 属性设置完并没有接收这个临时的包装对象，所以会删除delete，后面访问的时候不存在
  type.text = 'string';
}
console.log(type.text); // undefined

// ======

// 基于“==”进行比较的，会转换数据类型，有两种解决方案：
// 只有是一个对象，我们才能重构其转化的步骤
var a = {
  i: 0
};
// console.log(a[Symbol.toPrimitive]); // undefined
// console.log(a.valueOf()); // {i: 0} 不是原始值
// console.log(a.toString()); // '[object Object]'

// 重写 Symbol.toPrimitive/valueOf/toString
// 通过重写阻止数据类型转换

// a[Symbol.toPrimitive] = function toPrimitive() {
//   // this->a
//   return ++this.i; // i = 1
// };

// a[Symbol.toPrimitive]();
// // 第一次获取a,i=1,每获取一次a，i会加1
// if (a == 1 && a == 2 && a == 3) {
//   console.log('OK');
// }

// var a = [1, 2, 3];
// // 每一次返回的值依次是1 2 3
// a.toString = a.shift;
// if (a == 1 && a == 2 && a == 3) {
//   console.log('ok');
// }

// 全局上下文中，获取a的值：首先看VO(G)中有没有，没有再继续去GO(window)中查找
// var i = 0;
// Object.defineProperty(window, 'a', {
//   get() {
//     return ++i;
//   },
//   set(val) {
//     return val;
//   }
// });

