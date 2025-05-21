// Array.prototype.sort ES3

var arr = [5, 3, 1, 2, 6, 4];
var newArr = arr.sort();

// 1.返回原数组的引用，不进行数组引用赋值
// 使用的是原地算法
//   + Chrome V8当arr.length <= 10，使用插入排序，当arr.length > 10，使用快速排序
//   + Mozilla使用归并排序
//   + webkit使用c++的库QSort，快速排序的理念
console.log(newArr === arr); // true

// 2.sort不会按照数字大小进行排序
/* 
排序的过程：
1.数组元素先toString转字符串「扩大排序范围」
  字符串是DOMString，由UTF-16字符串实现，会映射到String的构造函数，来构建字符串
2.每一个字符串都是UTF-16字符串，是String/DOMString的实例
3.按照UTF-16的编码排序来进行排序
*/
var arr = [5, 3, 1000, 1, 6];
console.log(arr.sort());// [1, 1000, 3, 5, 6]

// 3.参数的规则
// sort有一个参数(可选): 比较函数方法(compareFunction)，参数(FElement,SElement)
var arr = [5, 3, 1, 2, 6, 4];
console.log(arr.sort(function (a, b) { }));

// return 负数  a b
// return 正数  b a
// return  0  a b 不进行排序操作
// 没有写排序规则，不进行任何排序操作
var newArr = arr.sort(function (a, b) {
  // b -> 3  a -> 5
  return a - b;
});
console.log(newArr); // [1, 2, 3, 4, 5, 6]

// 4.非ASCII字符排序
var arr = ['我', '爱', '你'];
console.log(arr.sort((a, b) => {
  return a.localeCompare(b);
}));//['爱', '你', '我']

// 5.字符串排序
var arr = ['zhangsan', 'Xiaoye', 'MIKE', 'tony'];

// 负载过高
console.log(arr.sort((a, b) => {
  var _a = a.toLowerCase(),
    _b = b.toLowerCase();

  // 字符串一般用判断
  if (_a < _b) {
    return -1;
  }

  if (_a > _b) {
    return 1;
  }

  return 0;
}));

// 优化
var arr = ['zhangsan', 'Xiaoye', 'MIKE', 'tony'];

// 先用数组扩展方法简单化，保存位置
var newArr = arr.map(function (item, index) {
  var it = {
    index,
    value: item.toLowerCase()
  }

  return it;
});

newArr.sort(function (a, b) {
  if (a.value > b.value) {
    return 1;
  }

  if (a.value < b.value) {
    return -1;
  }

  return 0;
});

var res = newArr.map(function (item) {
  console.log(item);
  return arr[item.index];
});
console.log(res);//  ['MIKE', 'tony', 'Xiaoye', 'zhangsan']