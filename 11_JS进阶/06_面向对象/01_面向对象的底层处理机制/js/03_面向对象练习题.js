// 1
/* 
fun函数的堆内存0x001
  [[scope]]: EC(G)
  ------
  this.a = 0;
  this.b = function(){
    alert(this.a);
  }
  ------
  name: 'fun' length: 0
*/

/* 
var my_fun = new fun(); 构造函数执行
EC(FUN)
AO: {

}
创建一个空实例对象0x002: 
{
  a: 0 -> 30
  b: 0x003
}
作用域链：<EC(FUN),EC(G)>
初始化this：指向实例对象0x002
初始化arguments：{length: 0}
形参赋值；-
变量提升: -
代码执行：

  this.a = 0; // 实例对象.a = 0
  this.b = function (){
    alert(this.a);
  } // 实例对象.b = 0x003
*/

/* 
my_fun.b();
b是私有方法
function(){
  alert(this.a); // 0
}

my_fun.c();
c是公有方法
function () {
  this.a = 30;  // my_fun.a = 30
  alert(this.a); // alert(my_fun.a) -> 30
}
*/

function fun() {
  this.a = 0;
  this.b = function () {
    alert(this.a);
  }
}

fun.prototype = {
  b: function () {
    this.a = 20;
    alert(this.a);
  },
  c: function () {
    this.a = 30;
    alert(this.a);
  }
}
var my_fun = new fun();
my_fun.b(); //"0"
my_fun.c(); //"30"

// 2
function C1(name) {
  // name->undefined
  // 不会给实例设置name私有属性
  if (name) {
    this.name = name;
  }
}

function C2(name) {
  // name->undefined
  // 给实例设置私有属性name，属性值是undefined
  this.name = name;
}

function C3(name) {
  // name-> undefined
  // 给实例设置私有属性name,属性值是'join'
  this.name = name || 'join';
}

C1.prototype.name = 'Tom';
C2.prototype.name = 'Tom';
C3.prototype.name = 'Tom';
alert((new C1().name) + (new C2().name) + (new C3().name));  // 'Tomundefinedjoin'