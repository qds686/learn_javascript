// Array.prototype.find：ES6新增

// 1，基本使用
// 1.1 返回第一个满足条件的数组元素
// const arr = [1, 2, 3, 4, 5];
// const item = arr.find(item => item > 3);
// console.log(item); // 4

// 1.2 如果没有一个元素满足条件，返回undefined
// const arr = [1, 2, 3, 4, 5];
// const item = arr.find(item => item > 5);
// console.log(item); // undefined

// 1.3 返回的元素和数组对应下标的元素是用一个引用
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
//   },
// ];
// const item = arr.find(item => item.name === '李四');
// console.log(item === arr[1]);//true 
// console.log(item); // {id:2, name: '李四'}

// 2.回调的参数和this
// 回调的参数：(当前遍历的元素，当前遍历的元素对应的下标，当前数组)
// this指向：find的第二个参数是更改回调函数内部的this指向
// 在没有第二个参数的情况下：非严格模式下，this指向window，严格模式下，this指向undefined
// const arr = [1, 2, 3, 4, 5];
// const item = arr.find(function (item, index, arr) {
//   console.log(item, index, arr); // 1 0 [1, 2, 3, 4, 5] ...
//   console.log(this); // this->{ a: 1 }
// }, { a: 1 });

// 3.find遍历稀疏数组
// const arr = Array(5); // [empty *5]
// arr[0] = 1;
// arr[2] = 3;
// arr[4] = 5;
// console.log(arr); // [1,,3,,5]

// 3.1 find会遍历稀疏数组的空隙，即empty。具体遍历出的值，由undefined占位
// const arr = [1, , 3, , 5];
// const item = arr.find(function (item) {
//   console.log('Gone'); // 执行5次Gone
//   console.log(item); // 遍历到空隙的时候是undefined
// });

// 3.2 ES5数组扩展方法「forEach、map、filter、reduce、ReduceRight、every、some」只会遍历有值的索引
// 结论：find的遍历效率是低于ES5数组扩展方法的
// const arr = [1, , 3, , 5];

// arr.forEach(function (item) {
//   console.log('Gone');// 执行3次Gone
//   console.log(item); // 1 3 5 
// });

// arr.reduce(function(item){
//   console.log('Gone'); // 执行3次Gone
// }, []);

// arr.every(function (item) {
//   console.log('Gone'); // 执行3次Gone
//   return true;
// });

// arr.some(function (item) {
//   console.log('Gone'); // 执行3次Gone
//   return false;
// });

// 4.操作回调数组中的元素

// 4.1 在find回调函数中修改数组中的元素，不会更改数组
// const arr = [1, 2, 3, 4, 5];
// const item = arr.find(function (item) {
//   console.log('Gone'); // 执行5次Gone
//   item += 1;
// });
// console.log(arr); // [1, 2, 3, 4, 5]

// 4.2 虽然新增了元素，但是find会在第一次执行回调函数的时候，拿到这个数组最初的索引范围，不会遍历增加的元素
// const arr = [1, 2, 3, 4, 5];
// const item = arr.find(function (item) {
//   arr.push(6);
//   console.log(item); // 1 2 3 4 5
// });
// console.log(arr); // [1, 2, 3, 4, 5, 6, 6, 6, 6, 6]

// 4.3 删除元素不够长度undefined占位
// const arr = [1, 2, 3, 4, 5];
// const item = arr.find(function (item, index) {
//   arr.splice(1, 1); // 删除元素不够长度undefined占位
//   console.log(item); // 1 3 5 undefined undefined
// });
// console.log(arr); // [1]

// 5.不同方法删除数组对应项
// 数组末尾有undefined，输出数组的时候只显示有值的元素
// 数组中间有undefined，正常输出数组元素
// const arr = [1, , 3, , , , 7, 8, 9];

// 5.1 删除了对应项，该项位置不保留，在数组最后补上undefined
// arr.find(function (item, index) {
//   if (index === 0) {
//     arr.splice(1, 1);
//   }
//   console.log(item);// 1 3 undefined undefined undefined 7 8 9 undefined
// });

// 5.2 删除该项的值并填入undefined
// arr.find(function (item, index) {
//   if (index === 0) {
//     delete arr[2];
//   }

//   console.log(item); // 1 undefined*5 7 8 9
// });

// arr.find(function (item, index) {
//   if (index === 0) {
//     arr.pop();
//   }

//   console.log(item); // 1 undefined 3 undefined*3 7 8 undefined
// });

Array.prototype.myFind = function (cb) {
  if (this === null) {
    throw new TypeError('"this" is null');
  }

  if (typeof cb !== 'function') {
    throw new TypeError('Callback must be a function type');
  }

  var obj = Object(this),
    len = obj.length >>> 0,
    arg2 = arguments[1],
    step = 0;

  while (step < len) {
    // 当前遍历的这一项
    var value = obj[step];
    // 回调函数返回真，把当前这一项返回
    if (cb.apply(arg2, [value, step, obj])) {
      return value;
    }

    step++;
  }
}
const arr = [1, 2, 3, 4, 5];

// const item = arr.myFind(item => item > 3);//4
const item = arr.myFind(item => item > 5);//undefined

console.log(item);
