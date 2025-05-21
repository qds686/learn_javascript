// Array.prototype.fill ES6中的方法
// fill方法是根据下标范围来给范围内的元素覆盖新的值

const arr = [1, 2, 3, 4, 5];

// 1.[start, end)
// const newArr = arr.fill('a', 2, 4);
// console.log(newArr); // [1, 2, 'a', 'a', 5];

// 2.end > length取length
// const newArr = arr.fill('b', 2, 5);
// console.log(newArr); // 1, 2, 'b', 'b', 'b']
// newArr 就是原数组的引用
// console.log(arr === newArr); // true

// 3.不写end = undefined，取length 
// const newArr = arr.fill('c', 2);
// console.log(newArr); // [1, 2, 'c', 'c', 'c']

// 4. 不写start和end，从索引0开始全部覆盖
// [undefined,undefined)=>[0,length)
// const newArr = arr.fill('d');
// console.log(newArr); // ['d', 'd', 'd', 'd', 'd']

// 5.start和end是负数，则 [start+length,end+length)
// const newArr = arr.fill('e', -4, -2);
// console.log(newArr); // [1, 'e', 'e', 4, 5]

// 6.全部覆盖undefined =>(undefined,0,length)
// const newArr = arr.fill();
// console.log(newArr); // [undefined, undefined, undefined, undefined, undefined]

// 7. start === end，不变
// const newArr = arr.fill('f', 1, 1);
// console.log(newArr); // [1, 2, 3, 4, 5]

// 8. 非数字(字符串&NaN&null)
// start是非数字，end是数字 => [0, end)
// start和end都是非数字 => 不变
// start是数字，end是非数字 => 不变

// const newArr = arr.fill('g', 'a', 'b'); // [1, 2, 3, 4, 5]
// const newArr = arr.fill('g', 1, 'b'); // [1, 2, 3, 4, 5]
// const newArr = arr.fill('g', 'a', 4); // ['g', 'g', 'g', 'g', 5]

// const newArr = arr.fill('h', NaN, NaN); // [1, 2, 3, 4, 5]
// const newArr = arr.fill('h', 1, NaN); // [1, 2, 3, 4, 5]
// const newArr = arr.fill('h', NaN, 4); // ['h', 'h', 'h', 'h', 5]

// const newArr = arr.fill('i', null, null); // [1, 2, 3, 4, 5]
// const newArr = arr.fill('i', 1, null); // [1, 2, 3, 4, 5]
// const newArr = arr.fill('i', null, 4); // ['i', 'i', 'i', 'i', 5]

// start和end都为undefined => 全部覆盖 
// start是数字，end为undefined => 正常覆盖 undefined相当于this.length
// start是undefined，end是数字 => [0, end) undefined相当于0

// const newArr = arr.fill('j', undefined, undefined); // ['j', 'j', 'j', 'j', 'j']
// const newArr = arr.fill('j', 1, undefined); // [1, 'j', 'j', 'j', 'j']
// const newArr = arr.fill('j', undefined, 4); // ['j', 'j', 'j', 'j', 5]
// console.log(newArr); 

// 9.对象调用
// const newObj = Array.prototype.fill.call({ length: 3 }, 4);
// console.log(newObj); // {0: 4, 1: 4, 2: 4, length: 3}

/* 
// 创建类数组方法
// arr表示数组
function makeArrayLike(arr) {
  var arrLike = {
    length: arr.length,
    push: [].push,
    splice: [].splice
  }

  arr.forEach(function (item, index) {
    [].fill.call(arrLike, item, index, index + 1);
  });
  return arrLike;
}
const ary = [1, 2, 3, 4, 5];
console.log(makeArrayLike(ary)); // {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5, push: ƒ, splice: ƒ} 
*/

Array.prototype.myFill = function () {
  var value = arguments[0] || undefined,
    // 保证是一个数字
    start = arguments[1] >> 0,
    end = arguments[2];

  if (this == null) {
    throw new TypeError('This is null or not undefined!');
  }

  var obj = Object(this),
    len = obj.length >>> 0;

  start = start < 0 ? Math.max(start + len, 0) : Math.min(start, len);

  end = end === undefined ? len : end >> 0;

  end = end < 0 ? Math.max(end + len, 0) : Math.min(end, len);

  while (start < end) {
    obj[start] = value;
    start++;
  }
  return obj;
}
