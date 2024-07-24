/* 
typeof value
  1. 返回的结果是字符串，字符串中包含了对应的数据类型
    a. "number"/"string"/"boolean"/"undefined"/"symbol"/"bigint"/"objtct"/"function"
  2. 局限性
    a. typeof null 结果是"object"
    b. typeof 对象/数组/正则/日期...都是“object”，基于 typeof 不能细分对象
  3. 检测原理
    a. 所有的“数据类型值”在计算机中，都是按照“二进制(0/1)”的值来进行存储的
      ⅰ. 000 对象、1 整数、010 浮点数、100 字符串、110 布尔、000000… null、-2^30 undefined
    b. typeof 检测数据类型就是根据它的“二进制值”检测的
  4. 局限性的原理
    a. typeof null 是 object 的原因是 null 在计算机中存储的二进制值是 64 个 0，以 000 开头的会认为是对象，所以，结果是“object”
    b. 所有的对象都是以“000 开头”，所以检测结果都是“object”，不能细分对象
  5. typeof 未被声明的变量 -> “undefined”
*/
// console.log(typeof 1); // "number"
// console.log(typeof NaN); // "number"
// console.log(typeof Infinity); // "number"
// console.log(typeof 'a'); // "string"
// console.log(typeof true); // "boolean"
// console.log(typeof undefined); // "undefined"
// console.log(typeof Symbol()); // "symbol"
// console.log(typeof 10n); // "bigint"

// console.log(typeof null); // "object"

// console.log(typeof {}); // "object"
// console.log(typeof []); // "object"
// console.log(typeof /^$/); // "object"
// console.log(typeof new Date()); // "object"
// console.log(typeof new Error()); // "object"
// console.log(typeof new Number()); // "object"
// console.log(typeof function(){}); // "function"
// console.log(typeof (()=>{})); // "function"

// console.log(typeof a); // "undefined"

// 不管多少个typeof结果都是"string"，因为最里边的typeof检测出来的结果永远都是字符串，逐层检测，最终还是string
// console.log(typeof typeof [10, 20]); // "string"


// ======================
// typeof 的应用
// 1.检测除null以外的原始值类型
var checkOriginType = function (val) {
  if (typeof val === "object" || typeof val === "function" || typeof val === "null") return;
  return typeof val;
}
var result = checkOriginType(1);
// console.log(result);

// 2.笼统的校验是否为对象
const isObject = function isObject(obj) {
  if (obj === null) return false;
  // return typeof obj === "object" || typeof obj === "function";
  return /^(object|function)$/.test(typeof obj);
};

// 3.检测是否为函数
if (typeof val === "function") {
  // ...
}

// 4.处理浏览器兼容「ES6+语法规范，都不兼容IE」
// 兼容的本质：是因为当前浏览器不具备这个“东西”，所以不兼容，这样我们就可以基于typeof检测它是否存在「哪怕不存在也不会报错，返回值是'undefined'」
if (typeof Symbol !== "undefined") {
  let sym = Symbol();
}


// =============
// 封装typeof
function myTypeof (val){
  var type = typeof val,
      toStr = Object.prototype.toString,
      temp = {
        '[object Object]': object,
        '[object Array]': object Array,
        '[object Number]': number,
        '[object String]': string,
        '[object Boolean]': boolean,
        '[object Undefined]': undefined
      };
  if(val === null){
    return 'null';
  }else {
    if(type === "object"){
      var ret = toStr.call(val);
      return temp[ret];
    }else {
      return type;
    }
  }
}

// JQuery封装
(function(){
  var class2Type = {};
  var toString = class2Type.toString; // Object.prototype.toString
  
  // 设定数据类型的映射表
  ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"].forEach(name =>{
    class2Type[`[object ${name}]`] = name.toLowerCase();
  });
  
  function toType(obj){
    if(obj == null){
       // 传递的值是null或者undefined，就返回对应的字符串
      return obj + "";
    }
    // 基本数据类型都来用typeof检测
    return typeof obj === "object" || typeof obj === "function" ?
      class2Type[toString.call(obj)] || "object" : 
      typeof obj;
  }
  
  window.toType = toType;
})();
toType(null) => "null"