/* 
正常情况下，babel-preset只能把ES6的语法转换为ES5，但是对于ES6中的内置API，是无法转换的
此时需要 @babel/polyfill:把ES6中很多内置的API进行重写
*/
(function () {

  /* 核心代码 */
  function Promise(executor) {
    //存储this指向
    var self = this;

    // init params
    if (typeof executor !== 'function') throw new TypeError("Promise resolver is not a function");
    if (!(self instanceof Promise)) throw new TypeError("undefined is not a promise");

    // private property
    self.state = "pending";
    self.result = undefined;

    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    // 传递状态和值，改变实例的状态和值
    var change = function change(state, result) {
      // 使用上级上下文this指向实例，函数内部this不指向实例
      if (self.state !== "pending") return;
      self.state = state;
      self.result = result;

      // 异步通知集合中的方法执行
      var callbacks = self.state === "fulfilled" ? self.onFulfilledCallbacks : self.onRejectedCallbacks;
      if (callbacks.length > 0) {
        setTimeout(function () {
          callbacks.forEach(callback => {
            callback(self.result);
          });
        });
      }
    }

    // run exector：new Promise((resolve, reject)=> {})
    try {
      executor(function resolve(value) {
        change('fulfilled', value);
      }, function reject(reason) {
        change('rejected', reason);
      });
    } catch (err) {
      change('rejected', err.message);
    }
  }

  /* 公共方法 */
  // 往原型对象上扩展公共属性
  var define = function define(key, value) {
    Object.defineProperty(Promise.prototype, key, {
      // 不可枚举：防止for in或者Object.keys把公用的属性也迭代到
      enumerable: false,
      configurable: true,
      writable: true,
      value: value
    });
  };

  // xx.then执行之前检查this是不是Promise实例
  var checkInstance = function checkInstance(self) {
    if (!(self instanceof Promise)) {
      throw new TypeError('Method then called on incompatible receiver #<Promise>');
    }
  }

  /* public property 原型对象 */

  // 可迭代
  define(Symbol.toStringTag, "Promise");
  // 实例.then
  define("then", function (onfulfilled, onrejected) {
    checkInstance(this);
    // 保证此时this就是Promise的实例
    var self = this;

    // 判断实例状态，执行then中的方法
    switch (self.state) {
      case "fulfilled":
        setTimeout(function () {
          onfulfilled(self.result);
        });
        break;
      case "rejected":
        setTimeout(function () {
          onrejected(self.result);
        });
        break;
      default:
        // state此时的值是 "pending", 不知道实例的状态
        // 先把要执行的方法存储到实例上，等待知道状态的时候再通知执行
        // 在change方法中异步通知集合中的方法执行
        self.onFulfilledCallbacks.push(onfulfilled);
        self.onRejectedCallbacks.push(onrejected);
    }
  });
  define("catch", function () {
    checkInstance(this);
  });

  /* 暴露API */
  // window存在，说明是浏览器环境
  if (typeof window !== "undefined") window.Promise = Promise;
  // 支持CommonJS规范
  if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();

// 1. 使用 new Promise(exector函数) 不传会报错 xx is not a function
// new Promise();

// 2. Promise只能被new执行
/*
ES6新增的一个语法：new.target 记录new的目标值
  + 存储new的那个构造函数，如果是当做普通函数执行，则值是undefined
  + 在构造函数外部访问不到new.target，会报错，需要再函数体中打印
用instanceof判断是否是Promise的实例
*/
// new Promise(() => { }); // 返回的是Promise函数体
// Promise(() => { }); // undefined

// 3.Promise执行会生成私有属性和公有属性
/*
私有属性：PromiseState/PromiseResult
*/
// let p = new Promise(() => { });
// console.log(p); // Promise {state: 'pending', result: undefined}

// 4.new Promise的时候会立即执行executor函数，会传递两个参数resolve 和 reject，参数也是函数
/*
new Promise((resolve, reject)=> {})
1.executor函数本身执行报错,用try catch,然后改变状态和值
2.一旦状态被修改为fulfilled或者rejected，后期就不会再更改状态值了
3.resolve把实例的状态改为fulfilled，reject把实例的状态改为rejected
*/
// let p = new Promise((resolve, rejected) => {
//   // resolve(10); // Promise {state: 'fulfilled', result: 10}
//   // rejected(0); // Promise {state: 'rejected', result: 0}

//   // 函数中报错
//   // rejected(err); // Promise {state: 'rejected', result: 'err is not defined'}
//   console.log(err); // romise {state: 'rejected', result: 'err is not defined'}
// });
// console.log(p); // Promise {state: 'fulfilled', result: 10}

// 5.用 Object.defineProperty(原型, key, cb) 给原型扩展then、catch、finally方法
// let p = new Promise(() => { });
// console.log(p); // 原型上也设置了公共属性catch then

// 6.实例.then()
/* 
1.保证this是实例，不是报错
2.Promise.then是一个异步微任务
  不考虑兼容，可以基于queueMicrotask(()=>{})
  考虑兼容，用定时器的异步宏任务模拟异步微任务
    + 然后执行参数，当pending的时候，要先把对应的函数存储在实例的数组中，因为有可能多个 实例.then执行，数组中就可以存储多个值
    + 当状态改变的时候，异步通知执行对应的参数
*/

// 依次输出：pending的Promise实例、1、2、成功：10

let p = new Promise((resolve, rejected) => {
  // resolve(10);
  // rejected(0);

  setTimeout(() => {
    // 先输出2，再通知成功
    resolve(100);
    console.log(2);
  }, 3000);
});
console.log(p); // pending的Promise实例
p.then(value => {
  console.log(`成功：${value}`);
}, reason => {
  console.log(`失败：${reason}`);
});

// 1先输出
console.log(1);

// Promise.prototype.then(); 报错，this不是实例







