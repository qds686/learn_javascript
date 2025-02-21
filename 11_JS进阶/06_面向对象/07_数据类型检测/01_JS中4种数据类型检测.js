// JS中检测数据类型

// 1.typeof [value]

// 1.1 底层机制：按照数据在计算机底层存储的“二进制”进行检测，效率比较快，返回的结果是字符串，字符串中包含了对应的数据类型

// 1.2 局限性
// @1 typeof null -> "object" null的二进制值是64个0，而typeof认为前三位是零的都是object
console.log(typeof null); // "object"

// @2 typeof 除了能够区分函数对象，其余对象无法细分
console.log(typeof function () { }); // "function"
console.log(typeof []); // "object"
console.log(typeof /^\d+$/); // "object"

// 1.3 浏览器的暂时性死区，typeof 未被声明的变量结果是 "undefined"
console.log(typeof m); // "undefined"

// 1.3 应用场景：检测除了null以外的其他原始值类型、笼统的检测是否为对象
// if(obj!==null && /^(object|function)$/.test(typeof obj)){
//   // obj是一个对象
// }

// 2.instanceof 本意是检测某个实例是否属于这个类，“临时”拉来检测数据类型，可以用来“细分对象”

// 2.1 无法处理原始值类型，返回结果都是false
console.log(1 instanceof Number); // false
console.log(new Number(1) instanceof Number); // true

// 2.2 任何对象基于 instanceof 检测是否为Object实例，结果都是true，所以无法区分是否为“标准普通对象「纯粹对象」”
console.log([10, 20] instanceof Array); // true
console.log([10, 20] instanceof Object); // true

// 2.3 由于可以肆意的修改原型的指向，所以检测出的结果是不准的


// 2.4 底层机制：实例 instanceof 构造函数

/* 
  @1 先检测 构造函数 是否拥有 Symbol.hasInstance 方法
    + ES6+之后，Function.prototype 设置了Symbol.hasInstance 这个方法，所以函数都具备这个属性
    + 如果有这个方法 构造函数[Symbol.hasInstance](实例) 返回值就是我们要的结果true/false
      + 我们正常情况下重写是无效的 -> Array[Symbol.hasInstance]=function(){...}
      + 但是基于class创建的自定义类，可以重写其Symbol.hasInstance方法
  @2 如果没有这个方法，则按照原型链进行查找：按照实例的__proto__一直向上找，直到找到Object.prototype为止，只要在实例的原型链上出现了“构造函数.prototype”，说明当前实例属于它，结果返回true；如果没有找到返回false

  总结：基于instanceof检测数据类型，其实“不是很靠谱”
    + 无法检测原始值类型
    + 无法区分是否为“标准普通对象”
    + 一旦原型链被重构，检测的记过是不准确的
    + ...
  真实项目中，偶尔用于初步检测是否为特殊对象，例如：检测是否为正则、日期对象等...
*/

// let arr = [10, 20];
// console.log(Array[Symbol.hasInstance](arr)); // true

// 正常下重写是无效的
/* 
let arr = [10, 20];
Array[Symbol.hasInstance] = function (arr) {
  return false;
};
console.log(arr instanceof Array); // true
*/

/* 
class Fn {
  constructor(name){
    if(name){
      this.name = name;
    }
  }
  sayName() {
    console.log(this.name);
  }
}
let f1 = new Fn('盒子');
// Fn[Symbol.hasInstance](f1)->true
console.log(f1 instanceof Fn, f1); // true Fn {name: '盒子'}

let f2 = new Fn;
// Fn[Symbol.hasInstance](f1)->true
console.log(f2 instanceof Fn, f2); // true Fn {}
*/

// 要求实例有name属性的返回true，没有的返回false
class Fn {
  constructor(name) {
    if (name) {
      this.name = name;
    }
  }
  sayName() {
    console.log(this.name);
  }

  // 静态私有属性方法，重写
  static [Symbol.hasInstance](obj) {
    return obj.hasOwnProperty('name');
  }
}
let f1 = new Fn('盒子');
console.log(f1 instanceof Fn, f1); // true

let f2 = new Fn;
console.log(f2 instanceof Fn, f2); // false

let arr = [10, 20];
console.log(arr instanceof Array); // true arr.__proto__ === Array.prototype
console.log(arr instanceof Object); // true arr.__proto__ === Object.prototype

/**
 * instance_of: 对内置instanceof的重写
 *   @params
 *     obj：要检测的实例
 *     ctor：要检测的构造函数
 *   @return 
 *     boolean
 */
var instance_of = function instance_of(obj, ctor) {
  // 检测值类型的校验：不支持原始值类型
  if (obj === null || !/^(object|function)$/.test(typeof obj)) return false;
  // 检测值类型的校验：ctor的格式
  if (ctor === null || !/^(object|function)$/.test(typeof ctor)) throw new TypeError('Right-hand side of instanceof is not an object');
  if (typeof ctor !== 'function') throw new TypeError('Right-hand side of instanceof is not callable');
  if (!ctor.prototype) throw new TypeError('Function has non-object prototype undefined in instanceof check');

  // 首先检测ctor是否拥有Symbol.hasInstance方法
  // 检测支持Symbol的浏览器，不支持也不会报错
  if (typeof Symbol !== "undefined") {
    var hasInstance = ctor[Symbol.hasInstance];
    if (hasInstance) {
      // ctor[Symbol.hasInstance](obj); // this->ctor
      return hasInstance.call(ctor, obj);
    }
  }

  // 按照原型链进行查找，看是否会出现ctor.prototype
  // 获取当前实例的原型对象 obj.__proto__
  var proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};
var arr = [10, 20];
console.log(instance_of(arr, Array)); // true
console.log(instance_of(arr, RegExp)); // false
console.log(instance_of(arr, Object)); // true

// 3.constructor
/* 
  if(对象.constructor === 构造函数){...}
  + 不准确：因为constructor可以被“肆意”重写
  + 相对于instanceof来讲，可以检测原始值类型，也可以判断是否为“标准普通对象”
  + 数组的深浅拷贝里判断数组或者对象创建实例
*/
// let arr = [];
// console.log(arr.constructor === Array); // true
// console.log(arr.constructor === object); // false

let obj = {};
console.log(obj.constructor === Object); // true

let num = 1;
console.log(num.constructor === Number); // true

// 4.Object.prototype.toString.call(value)
/* 
  1.内置构造函数的原型对象上，基本上都有toString这个方法，基本都是用来把值转换为字符串的，除了Object.prototype.toStirng外，它是用来检测数据类型的
  2.只需要把Object.prototype.toString执行，方法中的this是谁，就是检测谁的数据类型
    + 返回结果 "[object ?]"
    + ?一般是自己所属的构造函数
    + 首先会看value是否有 Symbol.toStringTag属性，有这个属性，属性值是啥，检测出来的?就是啥；如果没有这个属性，才一般按照自己所属的构造函数返回
      + 具备这个属性的值：
        + Math[Symbol.toStringTag]: "Math"
        + Promise.prototype[Symbol.toStringTag]: "Promise"
        + Generator函数原型链上有
        + Set.prototype[Symbol.toStringTag]: "Set"
        + Map.prototype[Symbol.toStringTag]: "Map"
        + ...

  优势：基本上属于检测最准确，最全面的方式了，能够区分null、能够检测原始值类型、能够细分对象，即便重构原型对象检测也是准确的....
*/
let toString = Object.prototype.toString;

// 重构原型对象，检测也是准确的
let obj2 = { 0: 10, length: 1 };
Object.setPrototypeOf(obj2, Array.prototype);
console.log(toString.call(obj2)); // '[object Object]'

// 面试题
class Fn1 { }
let f = new Fn1;
console.log(toString.call(f)); // "[object Object]"

// class Fn {}
// Fn.prototype[Symbol.toStringTag] = 'Fn';
// let f = new Fn;
// console.log(toString.call(f)); // "[object Fn]"

class Person {
  // 只要获取实例的[Symbol.toStringTag]属性值，则调用这个方法
  get [Symbol.toStringTag]() {
    return "Person";
  }
}
let p1 = new Person;
console.log(p1);
console.log(toString.call(p1)); //"[object Person]"