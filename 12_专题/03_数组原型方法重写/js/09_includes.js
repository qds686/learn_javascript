// 查询数组内是否包含某个元素 第一个参数
// 返回值是bool
const arr = [1, 2, 3, 4, 5];
console.log(arr.includes(3)); // true

// 特殊性：
// 区分字符串数字与数字
// 区分大小写
const arr = ['1', 'a', 3, 4, 5];
console.log(arr.includes(1)); // false
console.log(arr.includes('A')); // false

// 字符串includes区分大小写
console.log(String.prototype); // 有includes方法
var str = 'abcde';
console.log(str.includes('c'));//true
console.log(str.includes('f')); // false
console.log(str.includes('A')); // false

// 参数
// 1.includes的第二个参数 fromIndex从哪个索引开始找
// 第二个参数默认为0
// 不写参数直接返回false
var arr = [1, 2, 3, 4, 5];
console.log(arr.includes(5, 3));// true
console.log(arr.includes(2));// true
console.log(arr.includes());// false 
console.log(arr.includes.length);// 1 

// 2.第二个参数是负数 包含fromIndex
var arr = [1, 2, 3, 4, 5];

// arr.length + (-3) = 2
console.log(arr.includes(3, -3)); // true
// fromIndex >= arr.length return false 不会对数组进行搜索
console.log(arr.includes(3, 5)); // false
// arr.length + (-6) = -1 < 0 整个数组都会搜索 从0开始
console.log(arr.includes(3, -6)); // true

// 3.零值相等 same-value-zero
var arr = [0, 1, 2, 3, 4, 5];

console.log(arr.includes(0)); // true
console.log(arr.includes(-0)); // true
console.log(arr.includes(+0)); // true

// 7.除了数组和字符串，其他类型的数据使用includes
// includes是通用方法  调用者不一定非要是数组和对象 -> this不一定是数组和对象
console.log(Array.prototype.includes.call(1, 'a'));// false
console.log([].includes.call(1, 'a'));// false
console.log(Array.prototype.includes.call({ 0: 'a' }, 'a'));// false 类数组要有length

// 重写
Array.prototype.myIncludes = function (value) {
  if (this == null) {
    throw new TypeError('"this" is null');
  }

  var fromIndex = arguments[1],
    obj = Object(this),
    len = obj.length >>> 0;

  if (len === 0) return false;
  // 位或  如果fromIndex === undefined ? 0
  fromIndex = fromIndex | 0;

  fromIndex = Math.max(fromIndex >= 0 ? fromIndex : len + fromIndex, 0);

  while (fromIndex < len) {
    if (obj[fromIndex] === value) {
      return true;
    }

    fromIndex++;
  }

  return false;
}
var arr = [1, 2, 3, 4, 5];
console.log(arr.myIncludes(5, 3));// true
console.log(arr.myIncludes(2));// true
console.log(arr.myIncludes());// false 
console.log(arr.myIncludes.length);// 1 

console.log(arr.myIncludes(3, -3)); // true
console.log(arr.myIncludes(3, 5)); // false
console.log(arr.myIncludes(3, -6)); // true
