// 1
/**
 * 知识点：变量提升
 * 1.在当前上下文中，JS代码自上而下执行之前，浏览器从服务器端获取的JS都是文本或者是字符串，只不过声明了其格式是 "Content-Type:application/javascript"，浏览器首先按照这个格式去解析代码，把这个过程叫做“词法解析”阶段，目标是生成 “AST词法解析树”
 * 2.变量提升：浏览器然后会把所有带Var/function关键字的进行提前声明或者定义
 *   + 带var的只声明，带function的声明+定义
 *   + 有变量提升的时候先声明变量，再创建值
 *   + ES6没有变量提升，是先创建值，再声明变量
 *     + 基于let/const等声明的变量：在词法解析阶段，其实就已经明确了，未来在此上下文中，必然会存在这些变量，只是VO中变量值是undefined
 *     + 但是在代码执行中，如果出现在具体声明的代码之前使用这些变量，浏览器就会抛出引用错误Cannot access 'b' before initialization
 * 3.重复声明
 *   + 使用`let /const`等重复再声明这个变量就是语法错误
 * 4.推荐使用函数表达式，确保函数执行只能放在“创建函数”的下面，保证逻辑严谨性
 * 5.条件判断：在当前上下文中，变量提升阶段，不论条件是否成立，都要进行变量提升
 *   + var:还是只声明
 *   + function:判断体中的函数，在变量提升阶段，只声明不赋值
 * 
 * PS：只要报错，后面的代码都不再执行！！
 */

// 1
/**
 * EC(G):{
 *   VO(G)/GO:{
 *     a -> 12
 *   }
 *   变量提升：
 *     var a;
 * }
 * 代码执行
 */
// console.log(a); // undefined
// var a = 12;
// console.log(b); // 报错：Uncaught ReferenceError: Cannot access 'b' before initialization 
// let b = 12;

// 2
/**
 * EC(G):{
 *  VO(G)/GO:{ // 上下文中已经存在fn变量了，不会重复声明
 *    fn -> 0x000 [scope:EC(G)]
 *       -> 0x001 [scope:EC(G)] 
 *       -> 12
 *  变量提升：
 *    function fn(){ console.log(1); }
 *    var fn;
 *    function fn(){ console.log(2); }
 * }
 * 代码执行
 */
// console.log(fn); // 0x001
// // 0x000
// function fn(){ console.log(1); } // 跳过，变量提升阶段已经处理过了
// console.log(fn); // 0x001
// var fn = 12; // 跳过var fn操作，赋值的操作在变量提升阶段没处理，需要执行
// console.log(fn); // 12
// // 0x001
// function fn(){ console.log(2); } // 跳过，变量提升阶段已经处理过了
// console.log(fn); // 12

// 3
/**
 * 不论条件是否成立，都要进行变量提升
 *   + 对于var来讲，新老版本浏览器都没有任何影响，
 *   + 但是对于判断题中出现的function来讲，新老版本表现不一致：
 *     + 老版本函数是声明+定义  
 *     + 新版本 函数只会声明，不再定义
 * EC(G):{
 *   VO(G)/GO:{
 *     a
 *   }
 *   变量提升：
 *     var a;
 * }
 * 代码执行
 */
// console.log(a); // undefined
// if (!('a' in window)) { // !true = false 循环体不执行
//   var a = 13;
// }
// console.log(a); // undefined

// 4
// // 代码执行之前：全局上下文中的变量提升 var a; 默认是undefined
// console.log(a); //=> undefined

// var a = 12; //=> a=12 创建值12，不需要再声明a了，因为变量提升阶段完成了，完成的事情不会重新处理

// a = 13; //=> 全局变量a=13

// console.log(a); //=> 13

// 5
// // 全局上下文中的变量提升
// //   + func=函数 函数在这个阶段赋值都做了
// func(); //=>'OK'
// function func() {
//   var a = 12;
//   console.log("OK");
// }

// 6
// // 真实项目中建议 用函数表达式创建函数，因为这样在变量提升阶段只会声明func，不会赋值
// func(); //=>Uncaught TypeError: func is not a function
// var func = function () {
//   console.log('OK')
// }

// 7
// // 把原本作为值的函数表达式匿名函数“具名化”（在外边访问不到）
// // 当函数执行，在形成得私有上下文中，会把这个具名化得名字作为私有上下文中的变量（值就是这个函数）来进行处理
// var func = function AAA() {
//   console.log("OK");
//   console.log(AAA); //=>当前函数
//   AAA(); // 递归调用，而不用严格模式下都不支持的 arguments.callee
// }
// AAA(); //=>Uncaught ReferenceError: AA is not defined 函数表达式在外界是忽略名字的，访问不到
// console.log(typeof (AAA)); //=>浏览器暂时性死区：typeof中放一个未声明的变量是undefined
// func();

// 8
// console.log(a); //=>uncaught ReferenceError: a is not defined 后面不再运行
// a = 13;
// console.log(a);

// 9
// /**
//  * EC(G):全局作用域、全局上下文
//  *   词法解析、变量提升：
//  *      fn —— AF0/1/2/3 此处为最后一个函数
//  */
// fn();//5
// function fn() { console.log(1); }
// fn();//5
// function fn() { console.log(2); }
// fn();//5
// // 此处代码在变量提升阶段只声明了fn,可以不重复声明但是赋值操作一定是要继续进行的
// var fn = function fn() { console.log(3); }
// fn();//3
// function fn() { console.log(4); }
// fn();//3
// function fn() { console.log(5); }
// fn();//3

// 10
/**
* EC(G)
*  变量提升：把当前上下文中所有带var / function 进行提前的声明或者定义
*  【全局上下文中，基于var/function声明的变量，也相当于给window设置了对应的属性】
*          var a;
*          var b;
*          var c;
*          fn = 0x000 ; [[scope]]:EC(G)
* 代码执行
*/
// console.log(a, b, c); //=> undefined undefined undefined
// var a = 12,
//   b = 13,
//   c = 14;

// function fn(a) { //代码执行遇到创建函数的代码会直接的跳过：因为在遍历提升阶段已将处理过了
//   /**
//    * EC(FN)私有上下文
//    *  作用域链：<EC(FN),EC(G)>
//    *  形参赋值：a=12
//    *  变量提升：---
//    *  代码执行
//    */
//   console.log(a, b, c);//=> 12 13,14
//   a = 100;// 私有a=100
//   c = 200;// 全局c=200
//   console.log(a, b, c); //=> 100 13 200

//   //函数执行完成后：没有返回值（RETURN）、出栈释放
// }
// b = fn(10); // 先把函数执行，执行的返回结果赋值给全局变量b b=undefined
// console.log(a, b, c);//=>12 undefined 200

// 11
// /**
// * EC(G)
// *  变量提升：
// *      var i;
// *      A = 0x000; [[scope]]:EC(G)
// *      var y;
// *      B = 0x001; [[scope]]:EC(G)
// *  代码执行
// * 
// */
// var i = 0;

// function A() {
//   /**
//    * EC(A1) 闭包
//    *  作用域链：<EC(A1),EC(G)>
//    *  形参赋值：--
//    *  变量提升：
//    *      var i;
//    *      x = 0x100; [[scope]]:EC(A1)
//    */
//   var i = 10;

//   function x() {
//     /**
//      * EC(x1)
//      *  作用域链：<EC(x1),EC(A1)>
//      *  形参赋值：--
//      *  变量提升：--
//      */

//     /**
//      * EC(x2)
//      *  作用域链：<EC(x2),EC(A1)>
//      *  形参赋值：--
//      *  变量提升：--
//      */
//     console.log(i);// 10 10
//   }
//   return x;
// }
// var y = A(); //y= 0x100; 
// y(); //0x100() => 10

// function B() {
//   /**
//    * EC(B) 闭包
//    *  作用域链：<EC(B),EC(G)>
//    *  形参赋值：--
//    *  变量提升：
//    *      var i;
//    */
//   var i = 20;
//   y();// 0x100()
// }
// B(); // 0x001()
// //函数执行，他的上级作用域（上下文）是谁，和函数在哪执行是没有关系的
// //“只和在哪创建有关系”：在哪创建的，他的[[scope]]就是谁，也就是它的上级上下文就是谁

// 12
// /**
// * EC(G)
// *  变量提升：
// *      var a;
// *      var obj;
// *      fn = 0x000; [[scope]]:EC(G)
// *  代码执行
// */
// var a = 1;
// var obj = { //obj = 0x001
//   "name": "tom"
// }
// function fn() {
//   /**
//    * EC(FN)
//    *  作用域链：<EC(FN),EC(G)>
//    *  形参赋值：--
//    *  变量提升：
//    *      var a2;
//    */
//   var a2 = a; //私有 a2 =1
//   obj2 = obj; // window.obj2 = 0x001
//   a2 = a; //私有 a2 =1
//   obj2.name = 'jack'; //把全局0x001堆内存中的那么修改为’Jack‘
// }
// fn();
// console.log(a);//=>1
// console.log(obj);//=>{name:'jack'}

// 13
/**
* EC(G)
*  变量提升
*      var a;
*      fn=0x000; [[scope]]:EC(G)
*  代码执行
*/
// var a = 1;
// function fn(a) {
//   /**
//    * EC(FN)
//    *     作用域链：<EC(FN),EC(G)>
//    *     形参赋值：a=1
//    *     变量提升：
//    *         var a; 这一步浏览器会忽略，因为a私有变量已经存在于AO（FN）中了
//    *         a = 0x001; [[scope]]:EC(FN) 不会重复声明，但是需要重新赋值
//    */
//   console.log(a);//函数0x001
//   var a = 2;//=>a=2
//   console.log(a);//=>2
//   function a() {/*直接跳过，变量提升已经搞过了*/ }
//   console.log(a);//=>2
// }
// fn(a); // fn(1)
// console.log(a);//=>1

// 14
// /**
// * EC(G)
// *  变量提升
// *      var a;
// *      fn=0x000; [[scope]]:EC(G)
// *  代码执行
// */
// console.log(a);//=>undefined
// var a = 12;
// function fn() {
//   /**
//    * EC(FN)
//    *  作用域链：<EC(FN),EC(G)>
//    *  形参赋值：--
//    *  变量提升：
//    *      var a;
//    */
//   console.log(a);//=>undefined
//   var a = 13;
// }
// fn();
// console.log(a);//=>12

// /**
// * EC(G)
// *  变量提升
// *      var a;
// *      fn=0x000; [[scope]]:EC(G)
// *  代码执行
// */
// console.log(a);//=>undefined
// var a = 12;

// function fn() {
//   /**
//    * EC(FN)
//    *  作用域链：<EC(FN),EC(G)>
//    *  形参赋值：--
//    *  变量提升：--
//    */
//   console.log(a); //=>12
//   a = 13;// 全局a=13
// }
// fn();
// console.log(a); //=>13

// 15
// /**
// * EC(G)
// *  变量提升:
// *      fn=0x000; [[scope]]:EC(G)
// *  代码执行
// */
// console.log(a); //获取一个变量，首先看是否为自己私有变量，不是自己私有的，则按照作用域链查找，看是否为上级上下文的...一直到全局上下文为止！如果全局下也没有这个变量，则继续看window是否有这个属性，如果也没有这个属性，则直接报错：a is not defined ,后面代码不会执行
// a = 12;
// function fn() {
//   console.log(a);
//   a = 13;
// }
// fn();
// console.log(a);

// 16
// /**
// * EC(G)
// *  变量提升
// *      var foo;
// *  代码执行
// */
// var foo = 'hello';
// (function (foo) {
//   /**
//    * EC(AMY)
//    *  作用域链：<EC(SNY),EC(G)>
//    *  形参赋值：foo = 'hello'
//    *  变量提升：
//    *      var foo; (无需重复声明)
//    */
//   console.log(foo);//=>'hello'
//   // A||B:A为真返回A的值，A为假返回B的值
//   // A&&B:A为真返回B的值，A为假返回A的值
//   // ||和&&同时出现的时候，&&的优先级是高于||
//   var foo = foo || 'world'; // foo='hello'
//   console.log(foo); //=>foo='hello'
// })(foo);// 自执行函数（立即执行函数）执行：传递实参 'hello'
// console.log(foo);//=>foo='hello'

// 17
// {
//   function foo() { }
//   foo = 1;
//   function foo() { }
// }
// console.log(foo);

// {
//   let foo = 1;
//   function foo() { } // Uncaught SyntaxError:Identifier 'foo' has already been declared
// }

// 18
// // 在真实项目中，千万不要把function这个操作放在除了函数和对象的大括号中
// {
//   function foo() { }
//   foo = 1;
//   function foo() { }//把这一步之前的foo同步给全局
//   foo = 2; //私有的是2
//   console.log(foo); //=>2
// }
// console.log(foo);//=>1

// 19
// var x = 1;
// function func(x, y = function anonymous1() { x = 2 }) {
//   x = 3;
//   y();
//   console.log(x);
// }
// func(5);
// console.log(x);

// 20
// var x = 1;
// function func(x, y = function anonymous1() { x = 2 }) {
//   var x = 3;
//   y();
//   console.log(x);
// }
// func(5);
// console.log(x);

// 21
// var x = 1;
// function func(x, y = function anonymous1() { x = 2 }) {
//   /**
//    * 私有作用域
//    *  形参赋值
//    *      x = 5
//    *      y = function anonymous1()
//    */
//   /**
//    * 给块级作用域同步x,y默认值
//    * 变量提升
//    *      x = 5
//    *      y = function anonymous1()
//    * 形参赋值
//    *      x = 5 => 3
//    *      y = function anonymous2() 0x000 EC(EC(Y),BLOCK)
//    * 代码执行
//    */
//   var x = 3;//块级x=3
//   // 带var声明【var y = function】的function修改的是块级上下文的变量
//   // 直接变量执行【y()】的function修改的是私有作用域中的变量
//   var y = function anonymous2() { x = 4 }//修改块级x=4 y=function anonymous2()
//   y();
//   console.log(x);//=>4
// }
// func(5);
// console.log(x);//=>全局 1
