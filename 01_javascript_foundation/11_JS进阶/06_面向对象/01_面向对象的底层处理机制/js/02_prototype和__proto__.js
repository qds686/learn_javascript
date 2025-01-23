/* 
Fn函数的堆内存
  作用域：scope:EC(G)
  代码字符串：
    this.x = 100;
    this.y = 200;
    this.getX = function () {
      console.log(this.x);
    }
  键值对：
    name:"Fn" length:0
    prototype:Fn.prototype
    __proto__:Function.prototype
*/

/* 
Fn.prototype原型对象
  constructor: Fn

  getX:function...
  getY:function...

  __proto__:Object.prototype
*/

/* 
Object内置构造函数的函数堆
  [[scope]]:--

  <native code>

  name:"Object" length:1
  keys:function...
  assign:function....
  
  prototype:Object.prototype
  __proto__:Function.prototype
*/

/* 
Object.prototype原型对象
  constructor: Object

  hasOwnProperty
  isPratotypeOf
  propertyIsEnumerable
  toLocaleString
  toString
  valueOf

  __proto__:null 指向自己没有意义，基类
*/

/* 
let f1=new Fn;实例对象
  x:100
  y:200
  getX:function..

  __proto__:Fn.prototype
*/

/* 
let f2=new Fn;实例对象
  x:100
  y:200
  getX:function..

  __proto__:Fn.prototype
*/

/* 
f1.getX();找到方法、再确定this、最后算结果
  @1私有 @2this->f1 @3this.x===f1.x=100

*/
function Fn() {
  this.x = 100;
  this.y = 200;
  this.getX = function () {
    console.log(this.x);
  }
}
Fn.prototype.getX = function () {
  console.log(this.x);
};
Fn.prototype.getY = function () {
  console.log(this.y);
};
let f1 = new Fn;
let f2 = new Fn;
console.log(f1.getX === f2.getX); // false 都是私有的
console.log(f1.getY === f2.getY); // true
console.log(f1.__proto__.getY === Fn.prototype.getY); // true
console.log(f1.__proto__.getX === f2.getX); // false
console.log(f1.getX === Fn.prototype.getX); // false
console.log(f1.constructor); // Fn
console.log(Fn.prototype.__proto__.constructor); // Object
f1.getX(); // 100
f1.__proto__.getX();// undefined
f2.getY();// 200
Fn.prototype.getY();// undefined

/* 
  @1 大部分“函数数据类型”的值都具备“prototype(原型/显式原型)”属性
    + 属性值本身是一个对象
    + 浏览器会默认为其开辟一个堆内存，用来存储实例可调用的公共的属性和方法
    + 在浏览器默认开辟的这个堆内存中，「原型对象」有一个默认的属性constructor(构造函数/构造器)，属性值是当前函数/类本身
  @2 每一个“对象数据类型”的值都具备一个属性“__proto__(原型链/隐式原型)”，属性值指向“自己所属类的原型prototype”

*/

/* 
  函数数据类型
    + 普通函数
    + 箭头函数
    + 构造函数/类
    + 生成器函数Generator
    + ...

  不具备prototype的函数
    + 箭头函数
      let sum=()=>{}
      sum.prototype -> undefined
    + 基于ES6给对象某个成员赋值函数值的快捷操作
      let obj={
          fn(){...}
      }
      obj.fn.prototype -> undefined
    + ...
  
  对象数据类型值
    + 普通对象
    + 特殊对象：数组、正则、日期、Math、Error...
    + 函数对象
    + 实例对象
    + 构造函数.prototype
    + ...
*/

/* 
  构造函数模式好处；
    + 每一次NEW执行，都创造一个新的实例对象，实例和实例之间是“独立的”
    + 除了独立性，还具备“公有行”，都可以基于__proto__找到所属类原型对象上为其提供的公共属性方法
  ==> 非常方便的实现对“公/私”的管理，在插件、组件封装的时候，这个特点非常重要！！
*/

/* 
  所有对象都是Object内置类的实例
    + 在不确定“是谁NEW出来”的时候，可以让其指向Object.prototype
    + 基本任何对象最后都可以基于__proto__找到Object.prototype，所以，所有对象都是Object的实例

  所有函数都是Function内置类的实例
    + 不论是内置构造函数、自定义构造函数或者普通函数都是如此

  Object是所有对象的基类
    + Object.prototype.__proto__如果有值也是Object.prototype自己，没有意义
    + 所以此处的__proto__指向null
*/

/* 
原型链查找机制：当进行“成员访问”的时候，先找对象的私有属性
  + 如果存在，找的就是私有的
  + 如果不存在，则默认按照__proto__去其所属类的原型对象prototype上查找
  + 如果依然找不到，则继续基于原型对象的__proto__向上查找...直到找到Object.prototype为止
*/