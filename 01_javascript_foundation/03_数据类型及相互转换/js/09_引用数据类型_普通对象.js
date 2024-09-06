/**
 * 对象数据类型
 *   + 普通对象: {}, 例如类数组、实例、原型对象
 *   + 数组对象: []
 *   + 正则对象；/^$/
 *   + 日期对象
 *   + Set/Map
 *   + ...
 */
// 普通对象
// 1.对象是有零到多组键值对（属性名和属性值）组成的
//   + 属性名(键)不是变量，它是对象的一个属性
//   + 属性名一般都是一个字符串(基本数据类型值都可以作为属性名)
//   + 属性名不能是对象或者函数，对象或者函数作为属性名，浏览器会把其转换为字符串[objtct Object]作为属性名
var x = {};
var y = {
  // name叫做属性名，此处本身也是一个字符串 "name"
  // "hezi"是当前name属性的属性值
  name: "hezi",
  age: 18,
  0: 100,
  // 对于Symbol类型的属性名，需要基于[]包起来，保证语法正确性
  [Symbol('AA')]: 200,
  // 属性不是一个对象，而是变为最后的字符串 ({}).toString() => [objtct Object]
  [{}]: 300,
  x: 400
};
console.log(y);

// 2.获取一个对象中某个属性名对应的属性值，叫做“对象的成员访问”
//   + 对象.属性名
//      + 这种方式不能获取属性名为数字和Symbol类型的
//   + 对象[属性名]
//      + 属性名需要指定类型 "name" 0 Symbol()
var obj = {
  name: '盒子',
  0: 100
};
console.log(obj.name); // '盒子'
console.log(obj["name"]); // '盒子'
// console.log(obj.0); // Uncaught SyntaxError: missing ) after argument list

// 访问对象的某个成员，如果当前成员没有在对象中，不会报错，返回undefined
console.log(obj.age); // undefined
// 如果访问一个不存在的变量，则会报错
// console.log(age); // 报错：Uncaught ReferenceError: age is not defined

// 3.管理一个对象的成员
// 直接编写在大括号中（对于Symbol或者对象类型的属性名，以及需要把一个变量存储的值作为属性名，要基于中括号包裹起来，保证语法的正确性）
var sym = Symbol('xx');
var obj = {
  name: '盒子',
  0: 10,
  [sym]: '哈哈哈'
};
console.log(obj[sym]); // '哈哈哈'  

// 基于JS动态管理成员（增删改查）
//  + 对象的成员不允许重复， 0和'0' or true/'true'都是相同的成员处理，在动态管控的时候，之前有这个成员是修改，没有才是增加
var sym = Symbol('xx');
var obj = {
  name: '盒子',
  0: 10
};
// 增加
obj.age = 18;
obj["age"] = 18;
obj[sym] = '哈哈哈';
// 修改
obj["name"] = "盒子11"
// 查询
console.log(obj[0]); // 10
console.log(obj['0']); // 10
// 假删除：利用访问对象不存在成员返回undefined的特征，我们把某个成员的值修改为undefined，以后再获取这个成员，结果是undefined，我们可以认为当前成员是不存在的，本质还是存在的
obj.name = null;
console.log(obj.name); // null
// 真删除
delete obj.name;
console.log(obj.name); // undefined
console.log(obj); // {0: 10, age: 18, Symbol(xx): '哈哈哈'}

// 特殊对象
// 1.数组或者类数组对象
//   + 属性名是数字，而且数字从零开始逐级递增，称为“索引”
//   + 有一个length成员，存储集合的长度

var arr = [10, 20, 30];
console.log(arr); // [10, 20, 30]

var obj = {
  0: 10,
  1: 20,
  2: 30,
  length: 3
};
console.log(obj); // {0: 10, 1: 20, 2: 30, length: 3}








