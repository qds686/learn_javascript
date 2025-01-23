// 全局只分析堆内存
/* 
  Fn函数的堆0x001
  @1 作用域 
    [[scope]]:EC(G)
  @2 存储函数的代码字符串
    "let sum = 10;
    this.total = x + y;
    this.say = function () {
      console.log(`我计算的和是:${this.total}`);
    };"
  @3 存储键值对
    name:"Fn" length:2
*/

// 函数执行
/* 
  let res = Fn(10, 20); // 普通函数执行，函数执行无返回值
  EC(FN)
  AO(FN)
    x->10
    y->20
    sum->10
  初始化作用域链：<EC(FN), EC(G)>
  初始化THIS：window
  初始化arguments：{0:10, 1:20, length:2}
  形参赋值：x=10 y=20
  变量提升：--
  代码执行：
    let sum = 10;
    this.total = x + y; // window.total=20+10=30
    this.say = function () {
      console.log(`我计算的和是:${this.total}`);
    }; // window.say = 0x002 [[scope]]:EC(FN)

此时函数执行无返回值，全局res=undefined
*/

/* 
  let f1 = new Fn(10, 20); // 构造函数执行
  EC(FN)
  AO(FN)
    x->10
    y->20
    sum->10
  @1创建一个空实例对象 0x003
    total: 30
    say: 0x004
  初始化作用域链：<EC(FN), EC(G)>
  初始化THIS：@2 实例对象0x003
  初始化arguments：{0:10, 1:20, length:2}
  形参赋值：x=10 y=20
  变量提升：--
  代码执行：
    let sum = 10;
    this.total = x + y; // 实例对象.total=20+10=30
    this.say = function () {
      console.log(`我计算的和是:${this.total}`);
    }; // 实例对象.say = 0x004 [[scope]]:EC(FN)
  @3 默认返回实例对象
    return 0x003
f1=0x003
*/

/* 
  let f2 = new Fn;
  EC(FN)
  AO(FN)
    x->10
    y->20
    sum->10
  @1创建一个空实例对象 0x005
    total: 30
    say: 0x006
  初始化作用域链：<EC(FN), EC(G)>
  初始化THIS：@2 实例对象0x005
  初始化arguments：{0:10, 1:20, length:2}
  形参赋值：x=10 y=20
  变量提升：--
  代码执行：
    let sum = 10;
    this.total = x + y; // 实例对象.total=20+10=30
    this.say = function () {
      console.log(`我计算的和是:${this.total}`);
    }; // 实例对象.say = 0x006 [[scope]]:EC(FN)
  @3 默认返回实例对象
    return 0x005
f2=0x005
*/
function Fn(x, y) {

  let sum = 10;
  this.total = x + y;
  this.say = function () {
    console.log(`我计算的和是:${this.total}`);
  };
}
let res = Fn(10, 20); // 普通函数执行
let f1 = new Fn(10, 20); // 构造函数执行
let f2 = new Fn;
console.log(f1.sum); // undefined
console.log(f1.total); // 30
console.log(f1.say === f2.say); // false

/* 
  构造函数执行 VS 普通函数执行
  1.相同点
    构造函数执行也像普通函数执行一样，产生私有上下文(AO,初始化作用域链,初始化this,...,释放和不释放)
  2.区别
    @1 默认创建一个空实例对象
      + Fn被称之为类/构造函数
      + 创建的这个对象称之为类的实例对象·
    @2 让上下文中的this指向创建的实例对象
      + 代码执行中，出现的this.xxx = xxx，就是在给实例对象设置私有属性
      + let xxx=xxx 和实例对象没关系，只是给上下文中设置私有变量
    @3 观察函数的返回值 return
      + 如果函数返回的是“原始值类型值”或者没有返回值，则把创建的实例对象返回
      + 只有自己手动返回对象类型值，才以自己返回的为主
*/

/* 
Fn(10,20) 函数执行，产生私有上下文
Fn 函数本身堆内存
----------
new Fn(10,20) 构造函数执行，创建其一个实例
  + 有参数列表new
new Fn 构造函数也执行了，只不过没有传递实参
  + 无参数列表new
计算优先级：有参数列表new > 无参数列表new
*/