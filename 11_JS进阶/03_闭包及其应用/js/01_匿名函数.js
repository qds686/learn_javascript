/* 
匿名函数具名化：更规范一些，可以让原本的函数实现递归操作
  + 自执行函数
  + 函数表达式
    const fn = function fn(){};
    fn();
  --------
  1.不会再所处上下文(宿主环境)中声明：设置的名字在外面用不了
  2.在自己执行产生的上下文中会被声明赋值，赋的值是当前函数本身
  3.而且赋的值默认是不能被修改的：但是如果此名字被其他方式声明了(例如let/const/var...)，则以其他方式声明的为主
*/

var b = 10;
(function b() {
  b = 20;
  console.log(b); // 函数b
})();
console.log(b); // 10

(function fn() {
  let fn = 200;
  console.log(fn); // 200
})();
// console.log(fn); // Uncaught ReferenceError: fn is not defined

