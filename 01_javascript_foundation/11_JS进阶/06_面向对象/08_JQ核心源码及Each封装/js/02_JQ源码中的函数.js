// const getProto = Object.getPrototypeOf;
const class2type = {};
const toString = class2type.toString; // Object.prototype.toString 检测数据类型的
const hasOwn = class2type.hasOwnProperty; // Object.prototype.hasOwnProperty 检测是否为私有属性
// const fnToString = hasOwn.toString; // Function.prototype.toString 把函数转换为字符串
// const ObjectFunctionString = fnToString.call(Object); //把Object转换为字符串

// 一些浏览器中，createElement("object") === "function"
// typeof document.getElementsByTagName("div") === "function"
const isFunction = function isFunction(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
}

// obj不是null和undefined
// window.window===window
const isWindow = function isWindow(obj) {
  return obj != null && obj === obj.window;
}

// 检测数据类型的通用方法
// ['Boolean', 'Number', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol'].forEach(name => {
//   class2type["[object " + name "]"] = name.toLowerCase();
// });

// const toType = function toType(obj) {
//   // null 或 undefined
//   if (obj == null) {
//     return obj + "";
//   }
//   return typeof obj === "object" || typeof obj === "function"
//     // 在对照表中找，找不到就是object
//     ? class2type[toString.call(obj)] || "object"
//     : typeof obj;
// }

// 优化toType:返回所属类型的字符串
const toType = function toType(obj) {
  let reg = /^\[object ([\w\W]+)\]$/;
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function"
    ? reg.exec(toString.call(obj))[1].toLowerCase()
    : typeof obj;
}

// 检测是否是数组或类数组
const isArrayLike = function isArrayLike(obj) {
  let length = !!obj && "length" in obj && obj.length, // false || length值
    type = toType(obj);
  // 函数的length属性表示形参个数
  // window的length是页面中嵌套的iframe的个数
  if (isFunction(obj) || isWindow(obj)) {
    return false;
  }

  // 检测是数组||空类数组||length是大于0的数字，代表不是空类数组&&最后一项在obj中
  return type === "array" || length === 0 ||
    typeof length === "number" && length > 0 && (length - 1) in obj;
}

// 检测是不是纯粹对象或者是标准普通对象；obj.__proto__===Object.prototype
const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor;
  // 对象不存在null/undefined 或者 检测不是对象，返回false
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  // 获取当前对象的原型对象
  proto = Object.getPrototypeOf(obj);

  // 匹配 Object.create(null)
  if (!proto) {
    return true;
  }

  // 在原型对象的私有属性上是否有constructor属性
  // 如果有，则获取constructor，没有就是false
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  // 构造函数constructor是一个函数，并且是Object，即找的就是Object的原型
  return typeof Ctor === "function" && Ctor === Object;
}

// 检测是否为空对象
const isEmptyObject = function isEmptyObject(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
}
// 优化
const isEmptyObject = function isEmptyObject(obj) {
  let keys = Object.getOwnPropertyNames(obj);
  if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
  return keys.length === 0;
}

/* 
for in循环非常恶心，项目中尽可能不用它
  + 优先迭代数字属性，按照从小到大「对象本身的特征，我们解决不了这个问题」
  + 会迭代“私有”以及原型链上(公有) “所有” 可枚举的属性：它的循环会去原型链上找，非常消耗性能
  + 只能迭代“可枚举”的属性，不可枚举的拿不到
  + 不能迭代“Symbol类型”的属性

如果迭代对象中的每一项，我们可以先获取所有私有属性，再依次迭代
  + Object.keys(obj) 获取对象 “非Symbol类型”、可枚举的、私有属性 「结果：包含属性名的数组」
  + Object.getOwnPropertyNames(obj) 获取对象 非Symbol类型、私有属性，不论是否是可枚举的
  + Object.getOwnPropertySymbols(obj) 获取对象Symbol类型、私有属性，不论是否是可枚举的
如果我们想获取所有的私有属性：
  let keys = Object.getOwnPropertyNames(obj);
  if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
*/

Object.prototype.AA = 100;
let obj = {
  0: 10,
  1: 20,
  name: 'xxx',
  [Symbol('@1')]: 200
};
Object.defineProperty(obj, 'age', {
  enumerable: false,
  value: 13
});
// console.log(obj);


// 不能解决性能问题，只找私有属性
for (let key in obj) {
  if (!Object.hasOwnProperty(key)) break;
  console.log(key);//都是私有的属性
}

// 如果我们想获取所有的私有属性：
let keys = Object.getOwnPropertyNames(obj);
if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
console.log(keys);

// ES6中新增Reflect对象，ownKeys获取当前对象的所有私有属性，不论类型或者是否可枚举
let keys = Reflect.ownKeys(obj);
console.log(keys);

// 检测是否是有效数字：支持数字字符串
const isNumeric = function isNumeric(obj) {
  var type = toType(obj);
  return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
}

// 合并两个数组或者类数组
/* 
let arr1 = [10, 20];
let arr2 = [30, 40];
mergeArray(arr1, arr2) -> [10, 20, 30, 40]
最终改变的是first，second不变

let arr3 = {0: 10, 1:20, length:2};
let arr4 = {0: 20, 1: 30, length:2};
mergeArray(arr3, arr4); -> {0: 10, 1: 20, 2: 30, length: 4 }

mergeArray("前端", "开发");
-> String {0: '前', 1: '端', 2: '开', 3: '发'}
*/
// first和second必须是数组或者类数组
const mergeArray = function mergeArray(first, second) {
  // 如果传递的是字符串，则变为字符串的类数组集合
  if (typeof first === "string") first = Object(first);
  if (typeof second === "string") second = Object(second);

  // 如果传递的不是类数组，返回空数组
  if (!isArrayLike(first)) first = [];
  if (!isArrayLike(second)) second = [];

  let len = +second.length,
    j = 0,
    // 第一个类数组的长度+1
    i = first.length;
  for (; j < len; j++) {
    // 循环第二个类数组的每一项，然后放到第一个类数组的末尾
    first[i++] = second[j];
  }
  first.length = i;
  return first;
};

