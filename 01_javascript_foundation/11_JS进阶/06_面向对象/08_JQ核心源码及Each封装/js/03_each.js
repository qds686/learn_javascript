// 迭代数组、类数组、纯粹对象，支持迭代的结束
const each = function each(obj, callback) {
  let isArray = utils.isArrayLike(obj),
    isObject = utils.isPlainObject(obj);
  if (!isArray && !isObject) throw new TypeError('obj must be an array or likeArray or plainObject');
  if (!utils.isFunction(callback)) throw new TypeError('callback is not a function');

  if (isArray) {
    // 数组和类数组的迭代
    for (let i = 0; i < obj.length; i++) {
      let item = obj[i],
        index = i;
      if (callback.call(item, item, index) === false) break;
    }
    return obj;
  }

  // 对象的迭代：不用for in循环对象
  let keys = Object.getOwnPropertyNames(obj);
  if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i],
      value = obj[key];
    if (callback.call(value, value, key) === false) break;
  }
  return obj;
}

let arr = [10, 20, 30, 40],
  arr2 = { 0: 10, 1: 20, 2: 30, 3: 40, length: 4 },
  obj = { name: 'hezi', age: 18, 0: 100, [Symbol('AA')]: 200 };

// console.log(each()); // Uncaught TypeError: obj must be an array or likeArray or plainObject
// console.log(each(arr)); // Uncaught TypeError: obj must be an array or likeArray or plainObject

console.log(each(arr, (item, index) => {
  /* 
  10 0
  20 1
  [10, 20, 30, 40]
  */
  console.log(item, index);
  if (index >= 1) {
    return false;
  }
}));

console.log(each(arr2, (item, index) => {
  /* 
  10 0
  20 1
  { 0: 10, 1: 20, 2: 30, 3: 40, length: 4 }
  */
  console.log(item, index);
  if (index >= 1) {
    return false;
  }
}));

console.log(each(obj, (value, key) => {
  /* 
  100 '0'
  18 'age'
  200 Symbol(AA)
  hezi name
  */
  console.log(value, key);
}));