/**
 * 知识点：块级私有上下文
 * 除了“函数和对象”的大括号外，如果在大括号中出现了let/const/function/class 等关键词声明变量，则当前大括号会产生一个“块级私有上下文”
 *   + 它的上级上下文是所处的环境
 *   + var不产生，也不受块级上下文的影响
 */

// 1
/* 
EC(G)
  VO(G)/GO
    a -> 12 -> 100
    b -> 13
  变量提升
    var a;
  代码执行
*/
// console.log(a);//undefined
// console.log(b);//Uncaught ReferenceError: Cannot access 'b' before initialization

// var a = 12;
// let b = 13;
// if (1 == 1) {
//   /* 
//   EC(BLOCK) 块级私有上下文
//     VO(BLOCK)
//       b -> 200
//     作用域链：<EC(BLOCK),EC(G)>
//     没有this、arguments和形参赋值
//     变量提升：-- “带var关键字的不受块的任何影响”
//   */
//   console.log(a);//12
//   // console.log(b); //Uncaught ReferenceError: Cannot access 'b' before initialization 在块级上下文中，未来一定存在基于let声明的b，所以不允许在定义之前使用
//   var a = 100;//修改全局a
//   let b = 200;//私有变量
//   console.log(a);//100
//   console.log(b);//200
// }
// console.log(a);//100
// console.log(b);//13

// 2
/* 
在新版本浏览器中「按照ES6新语法规范」
1.判断体中出现了function，不论条件是否成立，都只是先声明，不定义
2.判断体中出现function会产生块级私有上下文
3.全局和块级上下文都声明过的function，要给全局同步一份，之后的不同步

EC(G)
  VO(G)/GO
    foo -> 同步0x000
  变量提升：
    function foo; 只声明
*/
// console.log(foo);//undefined
// if (1 === 1) {
//   /* 
//   EC(BLOCK)
//     VO(BLOCK)
//       foo -> 0x000 -> 1
//     作用域链：<EC(BLOCK),EC(G)>
//     初始化this、arguments、形参赋值：--
//     变量提升：
//       function foo() { } 声明+定义
//     代码执行
//   */
//   console.log(foo);//0x000
//   // 0x000
//   // 按照常理来讲，这个地方应该跳过，变量提升阶段已经完成过了，但是此时不行
//   //   + 因为这一行代码既被全局声明过，也被块声明过
//   //   + 它会把当前私有上下文中，本行代码以上，对foo的所有操作，同步给全局一份
//   //   + 但是本行代码以下对foo的操作和全局就没有关系了
//   function foo() { }
//   foo = 1;
//   console.log(foo); // 1
// }
// console.log(foo); // 0x000

// 3
/* 
EC(G)
  VO(G)/GO
    f -> 0x000(true) 
    g -> 0x001(false)
  变量提升:--
  代码执行
*/
// // 0x000
// f = function () { return true; };
// // 0x001
// g = function () { return false; };
// (function () {
//   /* 
//   EC(ANY)
//     VO(ANY) 
//       g -> undefined 
//     作用域链：<EC(ANY),EC(G)>
//     变量提升：function g(); 只声明
//     代码执行
//   */
//   // g() g是私有的0x003，返回true
//   // boolean([])-> false == ![]=false
//   if (g() && [] == ![]) { // g()->undefined() 此处报错 g is not a function
//     // 0x002
//     f = function () { return false; }
//     // 0x003
//     function g() { return true; }
//   }
// })();
// console.log(f());
// console.log(g());

// 4
/* 
EC(G)
  VO(G)
    foo -> undefined -> 0x000(同步) -> 0x001(同步) -> 1(同步)
  变量提升：
    function foo; 只声明
  代码执行
*/
// {
//   /* 
//   EC(BLOCK)
//     VO(BLOCK)
//       foo -> 0x000 -> 0x001 -> 1
//     作用域链：<EC(BLOCK),EC(G)>
//     变量提升：
//       function foo() { } 声明+定义
//       function foo() { }
//     代码执行
//   */
//   //  0x000
//   // 全局上下文和块级上下文都声明过的function要同步给全局上下文一份，这个后面的不同步
//   function foo() { }
//   foo = 1;
//   // 0x001
//   // 变量提升阶段就执行了，和上面一样要给全局作用域同步一份
//   function foo() { }
// }
// console.log(foo); // 1

// 5
/* 
EC(G)
  VO(G)
    x -> 1
    func -> 0x001
  变量提升；
    var x;
    function func(){...}
*/
// var x = 1;
// function func(x, y = function anonymous1() { x = 2 }) {
//   /* 
//   EC(FUNC)
//     AO(FUNC)
//       x -> 5 -> 3 -> 2
//       y -> 0x001
//     作用域链：<EC(FUNC),EC(G)>
//     形参赋值：
//       x = 5
//       y = anonymous1函数 「参数默认值」
//     变量提升；--
//     代码执行  
//   */
//   x = 3;
//   /* 
//   y()->0x001()
//   函数执行形成一个私有的作用域 EC(Y)
//     AO(Y)

//     作用域链：<EC(Y),EC(FUNC)>
//     变量提升：--
//     代码执行
//     x=2是上级上下文EC(FUNC)中的
//   */
//   y();
//   console.log(x); // 2
// }
// func(5);
// console.log(x); // 1

// 6
/* 
EC(G)
  VO(G)
    x -> 1
    func -> 0x000
  变量提升：
    var x;
    function func(){...}
  代码执行
*/
// var x = 1;
// function func(x, y = function anonymous1() { x = 2 }) {
//   /* 
//   func(5)->0x000() 
//   函数执行形成一个私有的作用域EC(FUNC)
//     AO(FUNC)
//       x -> 5 -> 2
//       y -> 0x001
//     作用域链：<EC(FUNC),EC(G)>
//     形参赋值：
//       x = 5
//       y = anonymous1函数
//     私有上下文形参赋值成功后，接下来的操作，都是在块级上下文中处理的=>把函数的大括号当做块级上下文
//   */
//   /* 
//   如果块级上下文中的某个私有变量和当前私有上下文中的形参变量的名字一样，还会把形参变量的值，默认给块级上下文一份....
//   => 但是不能让块级中基于let/const声明一个和私有中形参形同的变量，否则报重复声明的错误
//   EC(BLOCK)
//     VO(BLOCK)
//       x -> 5 -> 3
//     作用域链：<EC(BLOCK),EC(FUNC)>
//     变量提升： var x;
//     代码执行
//       var x = 3;
//       y();
//       console.log(x);
//   */
//   var x = 3;
//   /* 
//   y()->0x001()
//   函数执行形成一个私有的作用域 EC(Y)
//     AO(Y)

//     作用域链：<EC(Y),EC(FUNC)>
//     变量提升：--
//     代码执行
//     x=2是上级上下文EC(FUNC)中的
//   */
//   y();
//   console.log(x); //3
// }
// func(5);
// console.log(x); //1

// 7
/* 
EC(G)
  VO(G)
    x -> 1
    func -> 0x000
  变量提升：
    var x
    function func(){...}
  代码执行
*/
var x = 1;
// 0x000 0x001参数
function func(x, y = function anonymous1() { x = 2 }) {
  /* 
  EC(FUNC)
    AO(FUNC)
      x -> 5
      y -> 0x001
    作用域链：<EC(FUNC),EC(G)>
    形参赋值：
      x=5
      y=anonymous1函数
    之后的在块级作用域操作 
  */
  /* 
  EC(BLOCK)
    VO(BLOCK)
      x -> 5 -> 3 -> 4
      y -> 0x001 -> 0x002
    作用域链: <EC(BLOCK),EC(FUNC)>
    变量提升: 
      var x;
      var y;
    代码执行
  */
  var x = 3;
  // 0x002
  var y = function anonymous2() { x = 4 }
  y(); // 0x002()
  /* 
  EC(Y)
    AO(Y)

    作用域链：<EC(Y),EC(BLOCK)>
    变量提升：--
    代码执行：
      x是上级上下文EC(BLOCK)中的
  */
  console.log(x); // 4
}
func(5); // 0x000(5)
console.log(x); // 1