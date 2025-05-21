// 1.from的第一个参数
// 1.1 参数是一个数组  返回一个新的引用
// const arr = [1, 2, 3];
// const newArr = Array.from(arr);
// console.log(arr === newArr);//false

// 1.2 参数是一个带有引用类型元素的数组，返回的新数组是一个浅拷贝
// const arr = [
//   {
//     id: 1,
//     name: '张三'
//   },
//   {
//     id: 2,
//     name: '李四'
//   },
//   {
//     id: 3,
//     name: '王五'
//   }
// ];
// const newArr = Array.from(arr);
// console.log(arr[1] === newArr[1]); // true

// 1.3 参数是一个字符串 
// 可以理解为可迭代对象 Symbol(Symbol.iterator: ƒ [Symbol.iterator]()
// const str = '123';
// const newArr = Array.from(str);
// console.log(newArr); // ['1', '2', '3']

// 1.4 参数是一个Symbol 不是可迭代对象 - Arrayfrom不做处理，并且返回一个空数组
// const sm = Symbol('123');
// const newArr = Array.from(sm); 
// console.log(newArr); // []

// 1.5 参数是一个数字 不是可迭代对象 - Arrayfrom不做处理，并且返回一个空数组
// const num = 123;
// const newArr = Array.from(num);
// console.log(newArr); // []

// 1.6 参数是一个bool 不是可迭代对象 - Array.from不做处理，并且返回一个空数组
// const bool = true;
// const newArr = Array.from(bool);
// console.log(newArr); // []

// 1.7 参数是一个正则 不是可迭代对象 - Array.from不做处理，并且返回一个空数组
// const reg = /123/;
// const newArr = Array.from(reg);
// console.log(newArr); // []

// 1.8 参数是null undefined 
// const newArr = Array.from(undefined);
// const newArr = Array.from(null);
// const newArr = Array.from(/* undefined */);
// console.log(newArr); // Uncaught TypeError: undefined/null is not iterable (cannot read property Symbol(Symbol.iterator))

// 1.9 参数是一个普通的对象 不可迭代 - Array.from不做处理，并且返回一个空数组
// const obj = {
//   a: 1,
//   b: 2,
//   c: 3
// };
// const newArr = Array.from(obj);
// console.log(newArr); // []

// 1.10 参数是一个类数组
// 正常返回一个对应的数组的必要条件
// 1.键名必须从0开始按数字顺序排列
// 2.length属性必须正确

// const arrLike = {
//   0: 1,
//   1: 2,
//   2: 3,
//   length: 3
// };
// const newArr = Array.from(arrLike); 
// console.log(newArr); // [1, 2, 3]

// 长度决定了新数组的长度，属性名决定了填充该数组的位置
// const arrLike = {
//   0: 1,
//   1: 2,
//   2: 3,
//   length: 5
// };
// const newArr = Array.from(arrLike); 
// console.log(newArr); // [1, 2, 3, undefined, undefined]

// const arrLike = {
//   a: 1,
//   b: 2,
//   c: 3,
//   length: 3
// };
// const newArr = Array.from(arrLike); 
// console.log(newArr); // [undefined, undefined, undefined]]

//=> 总结：Array.from 的第一个参数必须要是可迭代对象或者标准的类数组「length属性和属性的个数相同」

// 1.11 参数是一个Map 可迭代对象
// const m = new Map([
//   ['a', 1],
//   ['b', 2],
//   ['c', 3]
// ]);
// console.log(m); // Map {'a' => 1, 'b' => 2, 'c' => 3}
// const newArr = Array.from(m); 
// console.log(newArr); // [['a', 1],['b', 2],['c', 3]]

// 1.12 参数是一个Set 可迭代对象
/* 
const s = new Set([1, 2, 3]);
console.log(s); // Set {1, 2, 3}
const newArr = Array.from(s);
console.log(newArr); // [1, 2, 3]

// 2.from的第二个和第三个参数
// 'use strict';
const arrLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
};
const newArr = Array.from(arrLike, function(item, index) {
  // 每一次遍历必须返回一个值，并且可以对返回的item进行处理
  // 回调函数有两个参数：
  // 由于回调执行的时候，Array.from还没有执行完毕，不存在逻辑上的新数组，所以无法在回调里获取到新数组本身(有别于数组的其他遍历方法)
  console.log(item, index); // 1 2 3  0 1 2

  // 非严格模式下，回调内部的this指向window
  // 严格模式下，回调内部的this 为 undefined

  // from方法的第三个参数会更改回调内的this指向
  console.log(this);
  return item;
}, {a: 1}); // [1, 2, 3]

// from的第二个参数的执行原理 从执行顺序上有区别 从实现上区别不大
const newArr = Array.from(arrLike).map(function(item, index, array){
  console.log(item, index, array);
  return item + 1;
}, {a: 1});//[2, 3, 4]

// 证明from方法的第一个参数是必填项
console.log(Array.from.length); // 1
*/

// 3.作用：填充数组 - 序列生成器
// start stop step
// function range(start, stop, step) {
//   // from自动取整 +1相当于向上取整
//   // 最后一位：9 / 2 + 1 = 5.5 -> from自动取整 5
//   // 类数组用数组的方法操作，即使length之前是小数，操作之后会更正length
//   return Array.from({ length: (stop - start) / step + 1 }, function (item, index) {
//     console.log(item, index); // 5个undefined 0 1 2 3 4
//     return start + (index * step);
//   });
// }
// // const r1 = range(1, 10, 2);// [1,3,5,7,9]
// const r2 = range(1, 10, 1);// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// console.log(r2); 

// 4.数组的合并与去重
// function combine() {
//   const arr = Array.prototype.concat.apply([], arguments);
//   return Array.from(new Set(arr));
// }
// const arr1 = [1, 2, 3, 4];
// const arr2 = [2, 3, 4, 5];
// const arr3 = [3, 4, 5, 6];
// console.log(combine(arr1, arr2, arr3)); // [1, 2, 3, 4, 5, 6]

// 5.Array.from实现
// 可迭代对象或者类数组：必填
// mapFn：可选
// this指向：可选
Array.myFrom = (function () {

  // 是否可调用 保证mapFn是一个函数
  const isCallable = function (fn) {
    return typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]';
  }

  const toInt = function (value) {
    const v = Number(value);

    if (isNaN(v)) return 0;

    if (v === 0 || !isFinite(v)) return v;
  	// 标准的正整数或者负整数
    return (v > 0 ? 1 : -1) * Math.floor(Math.abs(v));
  }

  const maxSateInt = Math.pow(2, 53) - 1;

  const toLength = function (value) {
    const len = toInt(value);
    return Math.min(Math.max(len, 0), maxSateInt);
  }

  return function (arrayLike) {
    const caller = this;

    if (arrayLike === null) {
      throw new TypeError('Method `from` requires an array-like object');
    }

    // 包装成对象
    const origin = Object(arrayLike);
    let arg2;

    const mapFn = arguments.length > 1 ? arguments[1] : void undefined;

    if (typeof mapFn !== 'undefined') {
      if (!isCallable(mapFn)) {
        throw new TypeError('mapFn must be a function');
      }

      if (arguments.length > 2) {
        arg2 = arguments[2];
      }
    }

    const len = toLength(origin.length);
    // Array.myFrom -> new Array(3) | (3).myFrom -> new Array(3)
    const arr = isCallable(caller) ? Object(new caller(len)) : new Array(len);

    let i = 0,
      val;

    while (i < len) {
      val = origin[i];

      if (mapFn) {
        arr[i] = typeof arg2 === 'undefined' ? mapFn(val, i) : mapFn.apply(arg2, [val, i]);
      } else {
        arr[i] = val;
      }
      i++;
    }
    return arr;
  }

})();

const arrLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
};

const newArr = Array.myFrom(arrLike, function (item, index) {
  console.log(item, index);
  return item + 1;
});

console.log(newArr);





