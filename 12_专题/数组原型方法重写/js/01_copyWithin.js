// copyWithin(es6):浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。

const arr = [1, 2, 3, 4, 5];

// 1.数组直接调用方法，说明是Array.prototype上的方法
// const newArr = arr.copyWithin();
// console.log(newArr); // [1, 2, 3, 4, 5]

// 2.参数 target start end

// 2.1 用 [start,end) 中的数替换 target
// const newArr = arr.copyWithin(0, 3, 4);
// console.log(newArr); // [4, 2, 3, 4, 5]

// 2.2 end > length-1, 取到末尾
// 把选出来的数组项，从target开始覆盖
// const newArr = arr.copyWithin(0, 3, 5);
// console.log(newArr); // [4, 5, 3, 4, 5]

// 2.3 target > length-1, 不发生任何替换
// const newArr = arr.copyWithin(5, 1, 2);
// console.log(newArr); // [1, 2, 3, 4, 5]

// 2.4 当target < start 正常替换
// const newArr = arr.copyWithin(3, 1, 3);
// console.log(newArr); // [1, 2, 3, 2, 3]

// 2.5 start 或 end是负数，则start+length / end+length
// const newArr = arr.copyWithin(0, -3, -1);
// console.log(newArr); // [3, 4, 3, 4, 5]

// 2.6 如果没有start，取整个数组的元素
//     copyWithin不改变数组的长度
// const newArr = arr.copyWithin(3);
// console.log(newArr); // [1, 2, 3, 1, 2]

// 2.7 如果没有end，从start取到数组末尾
// const newArr = arr.copyWithin(1, 3);
// console.log(newArr); // [1, 4, 5, 4, 5]

// 3. 返回值
// 返回的是原数组引用
// const newArr = arr.copyWithin(1, 3);
// console.log(newArr);
// console.log(newArr === arr); // true

// 4.移动数组元素，执行核心：复制选中的元素 =》全选target及符合复制元素集合长度的元素 =》粘贴复制的元素

// 4.1 数组元素是引用值
/* 
const arr1 = [
  {
    id: 1,
    name: '张三'
  },
  {
    id: 2,
    name: '李四'
  },
  {
    id: 3,
    name: '王五'
  },
  {
    id: 4,
    name: '赵六'
  },
  {
    id: 5,
    name: '刘十'
  }
];

const target1 = arr1[2];
const newArr = arr1.copyWithin(0, 2, 3);// index为2替换index为1这一项
const target2 = arr1[0];

console.log(target1 === target2); // true,说明就是复制地址 
*/

// 4.2 对象
// this不一定非要指向一个数组，也可以指向一个对象
// var obj = {
//   0: 1,
//   1: 2,
//   2: 3,
//   3: 4,
//   4: 5,
//   length: 5
// };

// const newObj = [].copyWithin.call(obj, 0, 2, 4);
// console.log(newObj); // {0: 3, 1: 4, 2: 3, 3: 4, 4: 5, length: 5}
// console.log(obj === newObj); // true

/* 
>> | <<：
  + 无符号位移，相当与先进行隐式Number()转换,然后再进行位移
  + 其中null、undefined、NaN、Infinity会强制转换为0，Symbol和BigInt类型无法转换为0
  + 整数位移高位补0，负数位移高位补1，位移存在符号
>>>：有符号位移，把取到的数取绝对值，变为正整数
  +  不管数是正或负，都是高位补0，结果都是正数
*/

Array.prototype.myCopyWithin = function (target) {
  if (this == null) {
    throw new TypeError('This is null or not defined!');
  }
  // 原始值包装为引用值
  var obj = Object(this),
    // 包装len是正整数
    len = obj.length >>> 0,
    start = arguments[1],
    end = arguments[2],
    // 计算复制的长度
    count = 0,
    dir = 1;

  // 保证target为整数「正|负」
  target = target >> 0;
  // 保证target为正整数：target为负数，和length相加变为正数再进行运算
  target = target < 0 ? Math.max(target + len, 0) : Math.min(target, len);

  start = start ? start : 0;
  start = start < 0 ? Math.max(start + len, 0) : Math.min(start, len);

  end = end ? end : len;
  end = end < 0 ? Math.max(end + len, 0) : Math.min(end, len);
  // 复制的长度和target后面的长度做比较
  count = Math.min(end - start, len - target);

  /* 
  当目标区域（target起始的位置）和源区域（[start, end)）存在重叠时，正向复制会导致覆盖问题

  从第2次赋值开始，第2次复制的是前一次粘贴的值
    arr = [1, 2, 3, 4, 5] => arr.copyWithin(2, 1, 4);
    target: 从3开始，源区域：[1,3]->[2,3,4]
    即[1,3]->[2,3,4]要替换目标区域的[2,4]->[3, 4, 5]
    第一次：arr[2]=arr[1] => arr=[1,2,2,4,5]
    第二次：arr[2]=arr[2] => arr=[1,2,2,2,5]
    第三次：arr[3]=arr[3] => arr=[1,2,2,2,2]
    这样发现后面的全被第一次的覆盖了，但是第一次是正确的，所以需要从后往前粘贴
    start=3,target=4 
    arr[4]=arr[3] => arr=[1,2,3,4,4]
    arr[3]=arr[2] => arr=[1,2,3,3,4]
    arr[2]=arr[1] => arr=[1,2,2,3,4] 正确
  */
  if (start < target && target < (start + count)) {
    dir = -1;
    start += count - 1;
    target += count - 1;
  }

  while (count > 0) {
    if (start in obj) {
      obj[target] = obj[start];
    } else {
      delete obj[target];
    }
    start += dir;
    target += dir;
    count--;
  }
  return obj;
}

// const newArr = arr.myCopyWithin(0, 3, 4);
// console.log(newArr); // [4, 2, 3, 4, 5]

const newArr = arr.myCopyWithin(2, 1, 3);
console.log(newArr); // [1, 2, 2, 3, 5]

/* 
delete obj[target]; 的作用
场景：处理稀疏数组（存在空槽）时，确保目标位置正确反映源位置的空槽。

稀疏数组的复制
  假设数组 arr = [1, , 3, , 5]（索引 1 和 3 是空槽），执行：
  arr.copyWithin(2, 0, 3); // 期望结果是什么？
  原生行为：结果为 [1, , 1, , ]
关键逻辑：
  源区域 [0,3) 的值是 [1, empty, 3]
  目标区域从索引 2 开始，覆盖 3 个元素
当复制空槽时：
  目标位置 2：arr[2] = arr[0] → 1（正常）
  目标位置 3：arr[3] = arr[1]（源是空槽 → 删除目标属性）
  目标位置 4：arr[4] = arr[2]（源是 3 → 覆盖）
删除 delete 语句的后果：
  错误实现（无 delete 逻辑）：
  - 目标位置 3 不会被删除，保留原值 `undefined` 或旧值
  - 最终结果可能变为 `[1, , 1, undefined, 3]`（错误）
*/

const arr1 = [1, , 3];
arr1.myCopyWithin(1, 0, 2);
console.log(arr1); // [1, 1, ]（正确，依赖 delete 逻辑）
