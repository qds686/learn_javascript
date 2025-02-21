/**
 * 知识点：对象的属性名是 “字符串/Symbol” 等类型的值
 *   变量知识一个名字
 *   属性名是一个值
 * 
 * 对象的成员访问：
 *   + obj.xxx  不适用于数字或者Symbol的成员
 *   + obj[xxx]  需要注意xxx需要是一个值
 */
// var name = 10;
// var obj = {
//   // name是属性
//   name: '盒子'
// };
// console.log(obj.name); // 访问成员为 “name” 的属性值 -> '盒子' 
// console.log(obj['name']); // 访问成员为 “name” 的属性值 '盒子' 
// console.log(obj[name]); // name不是值，是一个变量，相当于把变量name的存储的值作为成员访问的 -> undefined

/**
 * 知识点：循环的处理
 *   循环体中不论遇到下述哪一种关键字，当前这一轮循环的循环体，关键词下面的代码都不再执行
 *   + break：结束整个循环，包含最后的步长累计也不再执行
 *   + continue：结束本轮循环，继续执行步长累计，进行下一轮循环
 */
// 1
// for (var i = 0; i < 10; i++) {
//   console.log(i); // 0
//   break; // 整个循环都结束了
// }
// console.log(i); // 0

// 2
// for (var i = 0; i < 10; i++) {
//   continue; // 继续下一轮循环，步长累计需要处理
//   console.log(i); // 循环体 continue/break 下面的代码都不会执行
// }
// console.log(i); // 10

// 3
// break和continue后面的代码都不执行
// for (var i = 1; i <= 10; i += 2) {
//   // i = 1,4,7,5
//   if (i <= 5) {
//     i++;
//     continue;
//   } else {
//     i -= 2;
//     break;
//   }
//   i--;
//   console.log(i);
// }
// console.log(i); // 5

// 4
// 死循环：循环无法结束，啥都不输出
// for (var i = 3; i < 12; i++) {
//   // i = 3,3,
//   if (i < 3) {
//     i++;
//     break;
//   }
//   if (i > 9) {
//     i += 2;
//     continue;
//   }
//   i--;
// }
// console.log(i);

// 5
// for (var i = 10; i >= 2; i--) {
//   // i=10,7,4,0
//   if (i === 6) {
//     i -= 2;
//     break;
//   } else if (i <= 5) {
//     i = 2;
//   } else {
//     i -= 2;
//     continue;
//   }
//   i--;
//   alert(i);// '1'
// }
// alert(i);// '0'

// 6.把下面程序改写成三元运算符
// let a = 12;
// if (a >= 0 && a <= 20) {
//   if (a % 2 === 0) {
//     a += 2;
//   }
// } else {
//   a -= 2;
// }
// console.log(a);

// let a = 12;
// a >= 0 && a <= 20 ? (a % 2 === 0 ? a = a + 2 : null)
//                   : a = a - 2;
// console.log(a);

// 7
// let a = '10';
// a == 10 ? a++ : a--;
// console.log(a); // 11

// let b = '10';
// switch (b) {
//   // 每一种case情况的比较都是 === 绝对相等的比较
//   case 10: // '10' === 10 -> false
//     b++;
//     break;
//   default:
//     b--;
// }
// console.log(b); // 9

/**
 * 知识点：
 *  + 函数的创建和执行
 *  + 实参 & 形参
 *  + arguments 实参集合
 *  + ...params 基于剩余运算符获取传递的实参信息
 *  + return 返回值
 */

// 实现任意数求和
// function sum() {
//   var args = arguments,
//     total = 0;
//   for (var i = 0; i < args.length; i++) {
//     var item = Number(args[i]); // 也可以 +args[i] 把value值变为数字
//     if (isNaN(item)) continue;
//     total += item;
//   }
//   return total;
// }

// const sum = (...args) => {
//   let total = 0;
//   // JS中的“命令式编程”：注重的是代码执行的过程，我们可以有效管理过程中的每一步
//   for (var i = 0; i < args.length; i++) {
//     let item = +args[i];
//     if (!isNaN(item)) {
//       total += item;
//     }
//   }
//   return total;
// }

// const sum = (...args) => {
//   let total = 0;
//   // JS中的“函数式编程”：把具体操作的步骤封装成为函数，我们只关注结果，不注重过程上的处理
//   // 数组.forEach:用来循环遍历数组中每一项，每当遍历/迭代数组中的某一项，都会把传递的函数执行
//   args.forEach((item, index) => {
//     // item:当前遍历的这一项
//     // index:当前遍历这一项的索引
//     item = +item;
//     if (!isNaN(item)) {
//       total += item;
//     }
//   });
//   return total;
// }

const sum = (...args) => args.reduce((total, item) => total + (isNaN(item) ? 0 : +item), 0);

// var result = sum();
// console.log(result); // 0

// var result = sum(10);
// console.log(result); // 10

// var result = sum(10, 20);
// console.log(result); // 30

// var result = sum(10, 20, '30');
// console.log(result); // 60

// var result = sum(10, 20, '30', 'AA');
// console.log(result); // 60











