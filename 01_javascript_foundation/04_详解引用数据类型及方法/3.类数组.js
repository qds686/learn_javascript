// // 1.类数组的标志
// function test(){
//   /*
//     参数：
//         callee: 宿主函数 test
//         Symbol.iterator 可迭代对象标志
//         arguments 没有继承-> Array.prototype
//     类数组的标志：
//         1.length
//         2.从0开始的属性下标
//         3.没有数组的内置方法（build-in methods/object）可以使用, internal methods内部方法，不可以使用
//   */ 
//   console.log(arguments.callee); // test函数
//   console.log(test); // test函数，所以不用callee
//   console.log(arguments);
//   console.log(typeof(arguments)); // object
//   console.log(arguments.toString()); // [object Arguments]
//   console.log(Array.isArray(arguments)); // false
// }
// test(1,2,3,4,5,6);

// var arr = [1,2,3,4,5,6];
// console.log(arr); //[1, 2, 3, 4, 5, 6]

// // arguments是非箭头函数的其他函数的内置的局部变量
// var test = (...args) => {
//   console.log(args);// [1,2,3]
//   console.log(Array.isArray(args));// true
// };

// test(1,2,3);

// 2.类数组转为数组阻止JS引擎优化的解决方案
// function test1(){
//   // slice 用在arguments身上会阻止JS引擎做一些特定的优化
//   var argArr = [].slice.call(arguments);
//   // console.log(argArr); // [1, 2, 3]
// }
// test1(1,2,3);

// 解决方法1
// function test1(){
//   var arr = [];
//   for(var v of arguments){
//     arr.push(v);
//   }
//   console.log(arr); // [1, 2, 3]
// }
// test1(1,2,3);

// 解决方法2

// function test1() {
//   var argArr = arguments.length === 1 
//              ? [arguments[0]] 
//              : Array.apply(null, arguments); // 有一项放进来，多项用apply展开
//   console.log(argArr); // [1, 2, 3]
// }
// test1(1, 2, 3);

// 3.使用arguments的情况

// 3.1 实参个数 > 形参个数
// function test(a,b,c){
//   // arguments是实参的类数组集合
//   console.log(arguments[3]);//4
// }

// test(1,2,3,4);

// // 3.2 for循环对arguments做运算

// function test(a, b, c) {
//   console.log(arguments[3]);//4

//   for (var i = 0; i < arguments.length; i++) {
//     arguments[i] += 1;
//   }
//   console.log(arguments);// [2, 3, 4, 5, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// }

// test(1, 2, 3, 4);

// // 3.3 不定参数
// function test() {
//   console.log(arguments[3]);//4
// }

// test(1, 2, 3, 4);

// 4. 形参和实参对应关系-共享

// 跟踪-形参和实参默认情况下是会有共享的关系

// function test (a){
//   arguments[0] = 10;
//   console.log(a,arguments[0]);// 10 10
// }
// test(1);

// 不跟踪1-形参中但凡有一个参数有默认值，arguments都不会对应跟踪参数最终的值

// function test(a = 100) {
//   arguments[0] = 10;
//   console.log(a, arguments[0]);//1 10
// }
// test(1);

// function test(a = 100) {
//   a = 1000;
//   console.log(a, arguments[0]); // 1000 1
// }
// test(1);

// function test (a, b, c = 10){
//   arguments[0] = 100;
//   arguments[1] = 200;
//   arguments[2] = 300;
  
//   console.log(a, arguments[0]); // 1 100
//   console.log(b, arguments[1]); // 2 200 
//   console.log(c, arguments[2]); // 3 300
// }
// test(1,2,3);

// 不跟踪2-不定参数

// function test (...args){
//   arguments[0] = 100;
//   arguments[1] = 200;
//   arguments[2] = 300;
  
//   console.log(args[0], arguments[0]); // 1 100
//   console.log(args[1], arguments[1]); // 2 200 
//   console.log(args[2], arguments[2]); // 3 300
// }
// test(1,2,3);

// 不跟踪3-参数解构
// function test ({a,b,c}){
//   arguments[0] = 100;
//   arguments[1] = 200;
//   arguments[2] = 300;
  
//   console.log(a, arguments[0]); // 1 100
//   console.log(b, arguments[1]); // 2 200 
//   console.log(c, arguments[2]); // 3 300
// }
// test({
//   a:1,
//   b:2,
//   c:3
// });

// 不跟踪4-严格模式也不跟踪，不共享

// function test (a,b,c){
//   'use strict';
//   a = 10;
//   b = 20;
//   c = 30;
//   console.log(a,b,c);// 10 20 30 
//   console.log(arguments); //[1,2,3]
//   // console.log(arguments.callee);//去掉了这个
// }
// test(1,2,3);

// function test (a,b,c){
//   'use strict';
  
//   arguments[0] = 10;
//   arguments[1] = 20;
//   arguments[2] = 30;
  
//   console.log(a, arguments[0]); // 1 10
//   console.log(b, arguments[1]); // 2 20 
//   console.log(c, arguments[2]); // 3 30
// }
// test(1,2,3);