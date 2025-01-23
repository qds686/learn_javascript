/* 
原型重定向
1. 内置类的原型是无法重定向的
2. 在大量向原型上扩充方法的时候，重定向的操作一方面可以简化代码的编写，一方面也可以把所有扩充的公共属性和方法统一管理起来
弊端：重定向原型后，缺少了constructor，之前原型对象上存在的公共属性和方法也都没有了（包含constructor）
  + 如果之前原型上没有手动扩充任何属性方法，则重定向的原型对象手动设置一个constructor即可
  + 如果之前原型上还存在其他的属性方法，则在重定向之前做好做“新老”原型对象的合并处理
*/

// function Fn() {
//   this.x = 100;
//   this.y = 200;
// }
// Fn.prototype = {
//   constructor: Fn,
//   ...
// };

// --------------

function Fn() {
  this.x = 100;
  this.y = 200;
}
Fn.prototype.write = function () { };
Fn.prototype.read = function () { };
Fn.prototype = Object.assign(Fn.prototype, {
  constructor: Fn,
  say() { },
  eat() { },
  song() { },
  jump() { }
});
let f1 = new Fn;

