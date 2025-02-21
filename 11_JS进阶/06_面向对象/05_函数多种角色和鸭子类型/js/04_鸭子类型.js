/* 
鸭子类型
  + 类数组
  + 类promise
  + ...

类数组的结构和数组类似，但是不是数组「不是Array的实例」，所以无法直接使用Array.prototype原型上的方法，如果想用该如何处理
  + 把类数组转换为数组
  + 直接借用
    + 基于改变THIS
    + 赋值为私有属性
  ...
*/

let obj = {
  0: 10,
  1: 20,
  2: 30,
  length: 3
};

/* 类数组obj不能直接使用数组的方法 */
// obj.push(100); // Uncaught TypeError: obj.push is not a function

/* 1.把类数组转换为数组 */

// 方式一；用数组的方法，不兼容IE
// let arr = Array.from(obj);
// console.log(arr);

// 方式二；展开运算符
// let arr = [...obj]; 
// console.log(arr); // Uncaught TypeError: obj is not iterable

// 方式三：循环类数组每一项依次添加到数组中
// let arr = [];
// for(let i = 0; i < obj.length; i++){
//   arr.push(obj[i]);
// }
// console.log(arr);

/* 2.借用数组原型上方法实现对类数组的操作 */

// 可以借用数组的方法，原因是类数组的结构和数组几乎一样，那么操作数组的相关方法，同样也适合于操作类数组，此时我们只要把方法执行，让方法中的this改变为类数组，这样就相当于直接操作的是类数组 => "借用数组原型上方法实现对类数组的操作" 

// [].forEach.call(obj, (item, index) => {
//   console.log(item, index);
// });

// let arr = Array.prototype.slice.call(obj);
// console.log(arr);

/* 3.赋值为私有属性 */
// let obj1 = {
//   0: 10,
//   1: 20,
//   2: 30,
//   length: 3,
//   push: Array.prototype.push
// };
// obj1.push(1);
// obj1.push(2);
// console.log(obj1); // {0: 10, 1: 20, 2: 30, 3: 1, 4: 2, length: 5, push: ƒ}

/* 4.修改类数组的原型指向 */
Object.setPrototypeOf(obj, Array.prototype); //obj.__proto__===Array.prototype 只兼容IE11及以上
console.log(obj);