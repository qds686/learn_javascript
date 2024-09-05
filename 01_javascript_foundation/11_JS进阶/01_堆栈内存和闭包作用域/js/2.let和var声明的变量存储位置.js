var a = 12;
let b = 13;
c = 14;
/**
 * 区别1:
 * 全局上下文中
 *   + 基于 var 和 function 声明的变量，并没有放在VO(G)中，直接存储到GO中，作为window的一个成员
 *   + 基于 let/const 声明的变量，只存储在VO(G)中
 *   + 不加任何的声明关键词，直接放在GO中，相当于省略了 "window."
 */

/**
 * 区别2：
 * 全局上下文中
 *   + 基于 var 和 function 声明的变量，可以基于原型链查找变量的值，一直找到GO，如果GO中也没有，则报错，a is not defined
 *   + 基于 let/const 声明的变量，只能在VO中查找，在GO中访问不到，如果没有不会报错，值是undefined
 */

console.log(a); // 12 先看VO(G)，再看GO，如果GO中也没有，则报错，a is not defined
console.log(window.a); // 12 直接去GO找，如果没有不会报错，值是undefined
console.log(b); // 13
console.log(window.b); // undefined

