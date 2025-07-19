// Array.prototype.flat() ES2019->ES10
// 作用：flat扁平化 多维数组转化为一维数组

// 1.基本使用
// 返回一个新的数组，将二维数组转化为一维数组
// const arr = [0, 1, [2, 3], 4, 5];
// const newArr = arr.flat(); // [0, 1, 2, 3, 4, 5]
// console.log(newArr === arr); // false

// 2. 参数的4种情况
// 2.1 参数：结构深度 参数不写，默认为1，向数组内部深入一层，实际总共两层
// flat默认情况下是浅扁平化
// const newArr1 = arr.flat(); // [0, 1, 2, Array(2), 5, 6]
// 向内深入两层，实际有三层
// const newArr2 = arr.flat(2); // [0, 1, 2, 3, 4, 5, 6]

// 2.2 参数也可以是正无穷 Infinity 结构深度无穷大的设置
// const newArr3 = arr.flat(Infinity); // [0, 1, 2, 3, 4, 5, 6]

// 2.3 负数、0不做任何扁平化处理
// 数字必须从1开始填写一直到Infinity
// const newArr = arr.flat(0)
// const newArr = arr.flat(-2);

// 2.4 字符串会经过Number转换为数字类型
// const newArr = arr.flat('a'); // NaN不做处理
// const newArr = arr.flat('3'); // 转换为3
// const newArr = arr.flat(false); // 0 不做处理
// const newArr = arr.flat(true); // 1 处理一层

// 3. 稀疏数组
// 稀疏数组:剔除所有的数组空隙empty
// const arr1 = [1, , [2, , [3, 4, 5, , 6, [7, , , 8, 9, , [0]]]]];
// const newArr = arr1.flat(Infinity); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

// 4.concat特性
// concat是可以放入多个数组元素或者其他数组
// var a = 1,
//   b = [2, 3],
//   c = [3, 4];
// const newArr = b.concat(a, c);[2, 3, 1, 3, 4]

// 5.实现浅扁平化的两种方法
// function shallowFlat (arr) {
//   return arr.reduce(function (prev, current) {
//     return prev.concat(current);
//   }, []);
// }

// function shallowFlat (arr) {
//   return [].concat(...arr);
// }

// const arr = [0, 1, [2, [3, 4], 5], 6];
// console.log(shallowFlat(arr)); // [0, 1, 2, Array(2), 5, 6]

// 6.深扁平化的6种方法
// 6.1 reduce + concat + isArray + 递归
// Array.prototype.deepFlat = function () {
//   var arr = this,
//     deep = arguments[0] !== Infinity ? arguments[0] >>> 0 : Infinity;

//   return deep > 0 ?
//     arr.reduce(function (prev, current) {
//       return prev.concat(
//         Array.isArray(current) ?
//           current.deepFlat(deep - 1) : current
//       );
//     }, [])
//     : arr;
// }

// const arr = [0, 1, [2, [3, 4], 5], 6];

// console.log(arr.deepFlat(Infinity)); // [0, 1, 2, 3, 4, 5, 6]
// console.log(arr.deepFlat(1)); // [0, 1, 2, Array(2), 5, 6]
// console.log(arr.deepFlat(2)); // [0, 1, 2, 3, 4, 5, 6]

// 6.2  forEach + isArray + push + 递归
// Array.prototype.deepFlat = function () {
//   var arr = this,
//     deep = arguments[0] !== Infinity ? arguments[0] >>> 0 : Infinity,
//     res = [];

//   (function _(arr, deep) {
//     // 数组扩展方法会剔除empty
//     arr.forEach(function (item) {
//       if (Array.isArray(item) && deep > 0) {
//         _(item, deep - 1);
//       } else {
//         res.push(item);
//       }
//     })
//   })(arr, deep);

//   return res;
// }

// const arr = [0, 1, [2, [3, 4], 5], 6];

// console.log(arr.deepFlat(Infinity)); // [0, 1, 2, 3, 4, 5, 6]
// console.log(arr.deepFlat(1)); // [0, 1, 2, Array(2), 5, 6]
// console.log(arr.deepFlat(2)); // [0, 1, 2, 3, 4, 5, 6]

// 6.3 for of + isArray + push 需要去除empty
// Array.prototype.deepFlat = function () {
//   var arr = this,
//     deep = arguments[0] !== Infinity ? arguments[0] >>> 0 : Infinity,
//     res = [];

//   (function _(arr, deep) {
//     for (var item of arr) {
//       if (Array.isArray(item) && deep > 0) {
//         // 递归
//         _(item, deep - 1);
//       } else {
//         // 判断empty用void 0
//         item !== void 0 && res.push(item);
//       }
//     }
//   })(arr, deep);

//   return res;
// }

// const arr = [0, 1, [2, [3, 4], 5], 6];

// console.log(arr.deepFlat(Infinity)); // [0, 1, 2, 3, 4, 5, 6]
// console.log(arr.deepFlat(1)); // [0, 1, 2, Array(2), 5, 6]
// console.log(arr.deepFlat(2)); // [0, 1, 2, 3, 4, 5, 6]

// 6.4 stack pop + push
// 不需要参数及参数判断，返回深度扁平化的数组
// Array.prototype.deepFlat = function () {
//   var arr = this,
//       stack = [...arr],
//       res = [];

//   // stack.length = 0停止循环
//   while(stack.length) {
//     const popItem = stack.pop();

//     if(Array.isArray(popItem)) {
//       // 在栈最后展开这个数组变为一维
//       stack.push(...popItem);
//     } else {
//       res.push(popItem);
//     }
//   }

//   return res.reverse(); 
// }

// const arr = [0, 1, [2, [3, 4], 5], 6];

// console.log(arr.deepFlat(Infinity)); // [0, 1, 2, 3, 4, 5, 6]
// console.log(arr.deepFlat(1)); // [0, 1, 2, 3, 4, 5, 6]
// console.log(arr.deepFlat()); // [0, 1, 2, 3, 4, 5, 6]

// 6.5 纯递归的方式
// Array.prototype.deepFlat = function () {
//   var arr = this,
//       res = [];

//   (function _(arr) {
//     arr.forEach(function (item) {
//       if(Array.isArray(item)) {
//         _(item);
//       } else {
//         res.push(item);
//       }
//     })
//   })(arr);

//   return res;
// }

// const arr = [0, 1, [2, [3, 4], 5], 6];
// console.log(arr.deepFlat()); // [0, 1, 2, 3, 4, 5, 6]

// 6.6 生成器函数
function * deepFlat (arr) {
  for(var item of arr) {
    if(Array.isArray(item)) {
      yield * deepFlat(item);
    } else {
      yield item;
    }
  }
}

const arr = [0, 1, [2, [3, 4], 5], 6];
console.log([...deepFlat(arr)]); // [0, 1, 2, 3, 4, 5, 6]
