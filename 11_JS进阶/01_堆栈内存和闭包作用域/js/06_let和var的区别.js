// =>let 和 var 的区别
// 1.let不存在变量提升，不允许在定义之前使用
// console.log(a); // undefined
// var a = 12;
// console.log(b); // Uncaught ReferenceError: Cannot access 'b' before initialization
// let b = 13;

// 2.let不允许重复声明「不论当前上下文中，基于何种方式声明这个变量，都不允许基于let再次声明」
// Uncaught SyntaxError: Identifier 'a' has already been declared 在词法解析阶段，发现有基于let重复声明，词法解析就报错了，所以JS代码都不会执行
// console.log('OK');
// var a = 12;
// let a = 13;

// 3.在全局上下文中，基于var/function声明的变量，是给window(GO)设置的全局属性，基于let/const声明的变量是放在VO(G)中的，和GO没有任何的关系；
// var a = 12;
// let b = 13;
// console.log(a); // 先看VO(G)中有没有，没有则继续看GO中是否存在...  12
// console.log(window.a); // 直接到GO中查找 12 
// console.log(b); // 在VO(G)中查找 13
// console.log(window.b); // undefined
// // console.log(c); // Uncaught ReferenceError: c is not defined
// d = 100; // 先看VO(G)中是否存在d，如果存在则修改全局变量值，如果不存在，则直接给GO设置d的属性值（或者修改GO中d的属性值）
// console.log(window.d); // 100

// 4.let会产生块级上下文
// {
//   var a = 12;
//   let b = 13;
//   console.log(a, b); // 12 13
// }
// console.log(a); // 12 
// console.log(b); // Uncaught ReferenceError: b is not defined  因为b是块级上下文中私有的

// 5.let存在暂时性死区问题「在词法解析阶段，就已经知道会产生这个变量，但是在定义之前不能使用，ES6中使用会报错，ES5中不会报错」
// console.log(typeof a); // "undefined" 基于typeof检测一个未被声明的变量，结果不会报错，而是"undefined"

// console.log(typeof a); // Uncaught ReferenceError: Cannot access 'a' before initialization
// let a = 100;

// =>let 和 const 的区别
// const 声明的是常量，这句话是不准确的，它声明的还是变量
// 基于const声明的变量，首先必须赋值初始值，而且一旦和某个值关联，后期不允许更改其指针指向「也就是不重新赋值为其他值」
// const a; // Uncaught SyntaxError: Missing initializer in const declaration

// 改变指针指向
// const a = 12;
// a = 13; // Uncaught TypeError: Assignment to constant variable.

// 不改变指针指向，可以改变值
const obj = { name: 'hezi'};
obj.name = '盒子';
console.log(obj); // {name: '盒子'}


