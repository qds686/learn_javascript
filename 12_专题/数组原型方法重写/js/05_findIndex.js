// Array.prototype.findIndex
// 1.基本使用
// const arr = [1, 2, 3, 4, 5];

// 返回第一个满足条件的数组对应的元素下标
// const idx = arr.findIndex(item => item > 2);
// console.log(idx); // 2

// 没有找到符合条件的元素 返回-1
// const idx = arr.findIndex(item => item > 5); // -1
// console.log(idx); // -1

// const arr1 = [];
// const idx = arr1.findIndex(item => item > 2);
// console.log(idx); // -1

// 2.findIndex遍历稀疏数组
/**
 * 1.稀疏数组是正常遍历空隙的
 * 2.空隙将会被填充为undefined
 * 3.findIndex如果回调返回了true，遍历就停止
 */
// const arr1 = [,2,,,,,,];

// const idx = arr1.findIndex(item => item === 2);
// console.log(idx); // 1

// const idx = arr1.findIndex(function (item) {
//   console.log(item);// undefined 2
//   return item === 2;
// });

// console.log(idx); // 1

/**
 * findIndex会遍历所有稀疏数组的空隙
 * ES5的方法只会遍历有值的索引项(some/every/forEach/map/filter/reduce)
 */
// const idx = arr1.findIndex(function (item) {
//   console.log('Gone'); // 执行7次Gone
// });

// arr1.some(function (item) {
//   console.log('Gone'); // 只执行一次
//   return false;
// });

// 3.回调的参数和this
/* 
  + 回调函数：遍历的当前数组元素，元素对应的下标，源数组
  + 回调返回值：bool，遍历在某一次调用回调后返回true，停止
  + 第二个参数：
    + 更改回调内部的this指向
    + 默认情况下，this指向window
    + 设置了第二个参数，this是arg2
    + 严格模式下没有传第二个参数，this本身就是undefined
*/
// const arr = [1, 2, 3, 4, 5];
// const idx = arr.findIndex(function (item, index, arr) {
//   console.log(item, index, arr);
//   console.log(this);
// }, {a: 1});

// 4.操作回调数组中的元素

// 4.1 修改
// const arr = [1, 2, 3, 4, 5];

// 回调函数内部是无法改变数组的元素值
// const idx = arr.findIndex(function (item, index, arr) {
//   item += 1;
// });
// console.log(arr); //[1, 2, 3, 4, 5]

// 4.2 虽然增加了元素，但是遍历只会进行5次
// findIndex在第一次调用回调函数的时候已经确认数组的范围 5
// const idx = arr.findIndex(function (item) {
//   arr.push(6);
//   console.log('Gone'); // 执行5次
//   console.log(item); // 1 2 3 4 5
// });
// console.log(arr); [1, 2, 3, 4, 5, 6, 6, 6, 6, 6]

// 4.3 不同方法删除数组对应项
// 数组末尾有undefined，输出数组的时候只显示有值的元素
// 数组中间有undefined，正常输出数组元素
// const arr = [1, 2, 3, 4, 5];

// const idx = arr.findIndex(function (item, index) {
//   if(index === 0) {
//     arr.splice(1, 1); // 最后走的一次(第5次) 补undefined ，实际是删除了第一项
//   }
//   console.log(item); // 1 3 4 5 undefined
// });
// console.log(arr);// [1, 3, 4, 5]

// const idx = arr.findIndex(function (item, index) {
//   if(index === 0) {
//     delete arr[1]; // 删除对应下标的值并补undefined，实际数组中中对应下标变成 empty
//   }
//   console.log(item); // 1 undefined 3 4 5 
// });
// console.log(arr);// [1, empty, 3, 4, 5]

// const idx = arr.findIndex(function (item, index) {
//   if(index === 0) {
//     arr.pop(); // 删除元素下标对应的值，补undefined，实际删除了数组的最后一项
//   }
//   console.log(item); // 1 2 3 4 undefined
// });
// console.log(arr);// [1, 2, 3, 4]

Array.prototype.myFindIndex = function (cb) {
  if (this == null) {
    throw new TypeError('"this" is null');
  }

  if (typeof cb !== 'function') {
    throw new TypeError('Callback must be a function');
  }

  var obj = Object(this),
    len = obj.length >>> 0,
    arg2 = arguments[1],
    step = 0;

  while (step < len) {
    // 当前项的值
    var value = obj[step];

    if (cb.apply(arg2, [value, step, obj])) {
      return step;
    }

    step++;
  }

  return -1;
}

const arr = [1, 2, 3, 4, 5];

const idx = arr.myFindIndex(function (item, index, arr) {
  console.log(item, index, arr);
  console.log(this);

  return item > 2;
}, { a: 1 });

console.log(idx); // 2
