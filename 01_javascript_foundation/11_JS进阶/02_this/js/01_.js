/* 
我们研究的this，都是研究函数私有上下文中的this
  + 因为全局上下文中的this->window
  + 块级上下文中没有自己的this，在此上下文中遇到的this，都是其所处环境（上级上下文）中的this
  + ES6中的箭头函数和块级上下文类似，也是没有自己的this，遇到的this也是其上级上下文中的

THIS是执行主体：通俗来讲，谁把它执行的，而不是在哪执行的，也不是在哪定义的，所以THIS是谁和在哪执行和在哪定义都没有直接关系
*/

// 1.给DOM元素进行事件绑定(不论是DOM0还是DOM2)，当事件行为触发，绑定的方法执行，方法中的this是当前DOM元素本身
// document.onclick = function () {
//   console.log(this); // document
// };
// document.addEventListener('click',function(){
//   console.log(this); // document
// });

// 2.当方法执行，我们看函数前面是否有点
//   + 有：点前面是谁，this就是谁
//   + 没有：this就是window(非严格模式)或者undefined(严格模式)
//   + 匿名函数(自执行函数或者回调函数)中的this一般都是window/undefined，除非做过特殊的处理！
//   + setTimeout严格模式也是window

// const fn = function(){
//   console.log(this);
// };
// let obj = {
//   name: 'hezi',
//   fn
// };
// fn(); // this->window
// obj.fn();// this->obj

// 自执行函数：创建完立即执行
// "use strict";
// (function(){
//   console.log(this); // window/undefined
// })();

// 回调函数：把一个函数作为实参值，传递给另外一个函数「在另外一个函数中，把其执行」
// setTimeout(function(){
//   console.log(this); // window
// }, 1000);

// const fn = function fn(callback) {
//   callback();
// }
// fn(function () {
//   console.log(this); // window/undefined
// });

// let arr = [10, 20];
// let obj = { name: 'hezi' };
// arr.forEach(function (item, index) {
//   // console.log(item, index);
//   console.log(this); // window/undefined
// });

// arr.forEach(function (item, index) {
//   console.log(this); // obj
// }, obj); // forEach([回调函数],[修改回调函数中的this])


var x = 3,
  obj = { x: 5 };
obj.fn = (function () {
  this.x *= ++x;
  return function (y) {
    this.x *= (++x) + y;
    console.log(x);
  }
})();
var fn = obj.fn;
obj.fn(6);
fn(4);
console.log(obj.x, x);










