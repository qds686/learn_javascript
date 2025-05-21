// Array.prototype.flatMap ES2020 -> ES11

// 1.基本使用
const arr = ['123', '456', '789'];

// 1.1
// map返回数组，是一个二维数组
// const newArr = arr.map(function (item) {
//   return item.split('');
// });
// console.log(newArr); // [['1', '2', '3'],['4', '5', '6'],['7', '8', '9']]

// flat + map=== flatMap
// const newArr = arr.map(function (item) {
//   return item.split('');
// }).flat();
// console.log(newArr); // ['1', '2', '3', '4', '5', '6', '7', '8', '9']

// 遍历 + 扁平化 效率高
// 返回值是一个新的数组
// const newArr = arr.flatMap(function (item) {
//   // console.log(item);
//   return item.split('');
// })
// console.log(newArr === arr);// false

// 1.2
// 对字符串分段处理，形成数组，最后扁平化
// const arr1 = ['My name\'s hezi', 'I\'m 18', 'years old.'];

// const newArr = arr1.map(function (item) {
//   return item.split(' ');
// }); // [['My', "name's", 'hezi'],["I'm", '18'],['years', 'old.']]

// const newArr = arr1.flatMap(function (item) {
//   return item.split(' ');
// }) // ['My', "name's", 'hezi', "I'm", '18', 'years', 'old.']

// 2.参数与this
// 参数：(当前遍历的元素，当前遍历的元素在数组中对应的下标，数组本身)
// 回调中this默认指向window，严格模式下，this为undefined
// flatMat的第二个参数可以更改回调内的this指向
// const newArr = arr.flatMap(function (item, index, arr) {
//   console.log(this); // { a: 1 }
// }, { a: 1 })

// 3.flatMap的应用
// 作用：在数组中运算、增加一些项并且扁平化

// const arr2 = [1, -1, -3, 5, 8, -9, 6, 7, 0];

// 只要遇到负数就和前一项相加然后把字符串结果输出
// const newArr = arr2.flatMap(function (item, index) {
//   if (item < 0 && index >= 1) {
//     // 输出一个数组，变为二维数组，flatMap会自动变为一维数组
//     return [item, `${item} + ${arr2[index - 1]} = ${item + arr2[index - 1]} `];
//   }

//   return item;
// }) // [1, -1, '-1 + 1 = 0 ', -3, '-3 + -1 = -4 ', 5, 8, -9, '-9 + 8 = -1 ', 6, 7, 0]

// 4.实现flatMap

Array.prototype.myFlatMap = function (cb) {
  if (typeof cb !== 'function') {
    return new TypeError('Callback must be a function');
  }

  var arr = this,
    arg2 = arguments[1],
    res = [],
    item;

  for (var i = 0; i < arr.length; i++) {
    // 回调函数执行返回的结果
    // arr[i] 可以深克隆
    item = cb.apply(arg2, [arr[i], i, arr]);
    item && res.push(item);
  }

  return res.flat();
}

const arr1 = ['123', '456', '789'];

const newArr = arr1.myFlatMap(function (item) {
  return item.split('');
});

console.log(newArr); //['1', '2', '3', '4', '5', '6', '7', '8', '9']
