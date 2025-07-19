// for循环
// for(var i = 0; i < data.length; i++){
//   // element index array
//   console.log(data[i], i, data);
// }

// forEach 遍历
// Array.prototype.forEach
// 第二个参数是更改第一个参数函数this指向
// 第二个参数的值会强制转换为对应的对象数据类型，null和undefined不改变第一个参数的this指向
// data.forEach((item, index, array)=> {
//   console.log(item, index, array);
// }, {a: 1});

// 重写forEach
// var arr = [1, 2, 3, 4, 5];
// Array.prototype.myForEach = function (fn) {
//   var arr = this,
//     len = arr.length,
//     arg2 = arguments[1] || window;

//   for (var i = 0; i < len; i++) {
//     fn.apply(arg2, [arr[i], i, arr]);
//   }
// }

// filter 筛选 过滤，返回一个新的数组
// 第二个参数改变第一个参数的this
// var newArr = arr.filter(function (elem, index, array) {
//   // return 一个boolean值
// }, { a: 1 });

// 重写filter
// Array.prototype.MyFilter = function (fn) {
//   var arr = this,
//     len = arr.length,
//     arg2 = arguments[1] || window,
//     newArr = [],
//     item;

//   for (var i = 0; i < len; i++) {
//     item = deepClone(arr[i]);
//     fn.apply(arg2, [arr[i], i, arr]) ? newArr.push(item) : null;
//   }

//   return newArr;
// }

// map 映射
// 返回一个新数组
// var newArr = arr.map(function(elem, index, array){
//   // return什么就返回什么
// }, {a: 1});

// Array.prototype.myMap = function (fn) {
//   var arr = this,
//     len = arr.length,
//     arg2 = arguments[1] || window,
//     newArr = [],
//     item;

//   for (var i = 0; i < len; i++) {
//     item = deepClone(arr[i]);
//     newArr.push(fn.apply(arg2, [item, i, arr]));
//   }

//   return newArr;
// }

// every 如果有一个不满足条件就停止遍历，条件就是return的表达式
// some 有一个满足条件就停止遍历，条件就是return后面的表达式
// every 和 some 返回一个boolean值

// Array.prototype.myEvery = function (fn) {
//   var arr = this,
//     len = arr.length,
//     arg2 = arguments[1] || window,
//     item,
//     res = true;

//   for (var i = 0; i < len; i++) {
//     if (!fn.apply(arg2, [arr[i], i, arr])) {
//       res = false;
//       break;
//     }
//   }
//   return res;
// }

// Array.prototype.mySome = function (fn) {
//   var arr = this,
//     len = arr.length,
//     arg2 = arguments[1] || window,
//     item,
//     res = false;

//   for (var i = 0; i < len; i++) {
//     if (fn.apply(arg2, [arr[i], i, arr])) {
//       res = true;
//       break;
//     }
//   }
//   return res;
// }

// reduce 归纳函数
// 第一个参数比其他的函数多一个参数
// 第二个参数是必填项 initialValue
// var initialValue = [];
// [].reduce(function(prev, elem, index, arr){
//   // 这样输出prev只有第一个值，其他都是undefined，只有return了后面的才有值
//   // 第一次两个相等
//   // console.log(prev, elem, index, arr);
//   // console.log(initialValue === prev);

//   // return prev，返回的值都是[]，
//   // 所以每一次可以操作prev，归纳最后返回
//   prev.push(xxx);
//   return prev;
// }, initialValue);

Array.prototype.myReduce = function (fn, initialValue) {
  var arr = this,
    len = arr.length,
    arg2 = arguments[2] || window;

  for (var i = 0; i < len; i++) {
    initialValue = fn.apply(arg2, [initialValue, arr[i], i, arr]);
  }
  return initialValue;
}

Array.prototype.myReduceRight = function (fn, initialValue) {
  var arr = this,
    len = arr.length,
    arg2 = arguments[2] || window;

  for (var i = len - 1; i >= 0; i--) {
    initialValue = fn.apply(arg2, [initialValue, arr[i], i, arr]);
  }
  return initialValue;
}