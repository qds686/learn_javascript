// Array.prototype.entries es6

// 1. 使用方法，返回数组的迭代器对象 Array Iterator {}
//    {value:[index,item], done: ?}
// const arr = [1,2,3,4,5];

// const it = arr.entries();
// console.log(it.next()); 
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

// 2.for.in 和 for.of 循环数组和对象
// 2.1 for.in 循环对象，得到key和value

// var o = {
//   a: 1,
//   b: 2,
//   c: 3
// };
// for (let k in o) {
//   console.log(k, o[k]);
// }

// const arr = [1, 2, 3, 4, 5];
// for (let i in arr) {
//   console.log(i, arr[i]);
// }


// 2.2 for.of循环迭代器对象，得到index和value

/* 
// 1.for.of循环数组，只能得到value
const arr = [1,2,3,4,5];
for(let v of arr){
  console.log(v); // 1到5
}  
*/

/* 
// 2.for.of不能循环对象，因为没有 Symbol.iterator 属性
let o = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
}
for(let v of o){
  console.log(v); // Uncaught TypeError: o is not iterable
} 
*/

/* 
// 3.在 对象 或者 Object.prototype 上加这个属性对象就可以被 for.of 遍历
let o = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  // [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
Object.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

for (let v of o) {
  console.log(v); // 1 2 3
}
*/

/* 
// 4.for.of循环数组迭代器对象，可以得到index和value
const arr = [1, 2, 3, 4, 5];
let it = arr.entries();
for (let c of it) {
  let [index, value] = c;
  console.log('index:' + index, 'value:' + value); // index:0 value:1 ... index:4 value:5
} 
*/

// 3.案例：循环迭代器对象，把value放到一个新数组中

// let newArr = [];
// const arr = [1, 2, 3, 4, 5];
// const it = arr.entries();
// for (let i = 0; i < arr.length + 1; i++) {
//   let item = it.next();
//   !item.done && (newArr[i] = item.value);
// }
// /* 
// [
//   0: [0, 1]
//   1: [1, 2]
//   2: [2, 3]
//   3: [3, 4]
//   4: [4, 5]
// ]
// */
// console.log(newArr);

// 4.多维数组的排序
const newArr = [
  [56, 23],
  [56, 34, 100, 1],
  [123, 234, 12]
];

function sortArr(arr) {
  var _it = arr.entries(),
    _doNext = true;
  while (_doNext) {
    var _r = _it.next();

    if (!_r.done) {
      _r.value[1].sort(function (a, b) {
        return a - b;
      });
      _doNext = true;
    } else {
      _doNext = false;
    }
  }
  return arr;
}
console.log(sortArr(newArr));






