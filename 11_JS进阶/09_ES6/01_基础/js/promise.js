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
      change('rejected', err);
    }
  }

  /* 公共方法 */
  // 往"原型对象"和"静态私有属性"上设置不可枚举的属性方法
  var define = function define(obj, key, value) {
    Object.defineProperty(obj, key, {
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

  // 处理then方法返回的新实例promise的状态和值
  // promise:新实例 x:onfulfilled/onrejected执行的返回值 
  // resolve & reject：控制成功和失败
  // promise的成功和失败取决于x
  var resolvePromise = function resolvePromise(promise, x, resolve, reject) {
    if (x === promise) throw new TypeError("Chaining cycle detected for promise #<Promise>");

    // x是对象或函数，不一定是promise实例
    if (x !== null && /^(object|function)$/.test(typeof x)) {
      var then;
      try {
        then = x.then;
      } catch (err) {
        // 获取then方法的时候，抛错
        reject(err);
        return;
      }
      if (typeof then === "function") {
        // x是一个promise实例了，相当于x.then()

        // 只能执行一个函数，防止两个函数同时执行
        var called = false;
        try {
          then.call(x, function onfulfilled(y) {
            if (called) return;
            called = true;

            // return Promise.resolve(Promise.reject(-1)); 虽然是成功的，但是返回的promise实例的值可能还是promise实例
            resolvePromise(promise, y, resolve, reject);
          }, function onrejected(r) {
            if (called) return;
            called = true;
            reject(r);
          });
        } catch (err) {
          // 执行then方法的时候抛错
          if (called) return;
          called = true;
          reject(err);
        }
        return;
      }
    }
    // 不是对象或函数
    resolve(x);
  }

  // isIterator：验证传递的值是否是符合ITerator迭代器规范
  var isIterator = function isIterator(obj) {
    if (Array.isArray(obj)) return true;
    if (obj == null) return false;
    var flag = false;
    if (typeof Symbol !== "undefined" && obj[Symbol.iterator]) flag = true;
    return flag;
  }

  // 验证是否为promise实例
  var isPromise = function isPromise(x) {
    if (x != null && /^(object|function)$/.test(typeof x)) {
      var then;
      try {
        then = x.then;
      } catch (_) {
        return false;
      }
      if (typeof then === "function") {
        return true;
      }
    }
    return false;
  }

  /* public property 原型对象 */
  var proto = Promise.prototype,
    toString = Object.prototype.toString;

  // 可迭代
  if (typeof Symbol !== "undefined") {
    define(proto, Symbol.toStringTag, "Promise");
  }

  // 实例.then
  define(proto, "then", function (onfulfilled, onrejected) {
    checkInstance(this);
    // 保证此时this就是Promise的实例
    var self = this,
      // 新实例
      promise;

    // then链穿透机制
    onfulfilled = typeof onfulfilled === "function" ? onfulfilled : function (value) { return value; };
    onrejected = typeof onrejected === "function" ? onrejected : function (reason) { throw reason; };

    // promise的then链：每次执行then要返回一个全新的promise实例
    promise = new Promise(function (resolve, reject) {
      // 判断实例状态，执行then中的方法
      // executor执行先看有没有报错，报错reject执行，没有报错接收返回值，看是不是Promise实例
      switch (self.state) {
        case "fulfilled":
          setTimeout(function () {
            try {
              var x = onfulfilled(self.result);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
          break;
        case "rejected":
          setTimeout(function () {
            try {
              var x = onrejected(self.result);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
          break;
        default:
          // state此时的值是 "pending", 不知道实例的状态
          // 先把要执行的方法存储到实例上，等待知道状态的时候再通知执行
          // 在change方法中异步通知集合中的方法执行
          self.onFulfilledCallbacks.push(function (value) {
            try {
              var x = onfulfilled(value);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
          self.onRejectedCallbacks.push(function (reason) {
            try {
              var x = onrejected(reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
      }
    });

    return promise;
  });
  define(proto, "catch", function (onrejected) {
    checkInstance(this);
    var self = this;
    return self.then(null, onrejected);
  });
  define(proto, "finally", function (callback) {
    checkInstance(this);
    var self = this;

    // 确保callback是函数
    callback = typeof callback === "function" ? callback : function () { };
    return self.then(
      function (value) {
        // 这样保证返回的是promise实例有then方法
        return Promise.resolve(callback()).then(function () {
          return value;
        });
      },
      function (reason) {
        return Promise.resolve(callback()).then(function () {
          throw reason;
        });
      }
    );
  });

  /* 静态私有属性：把promsie当做普通对象 */
  define(Promise, "resolve", function (value) {
    // 如果传入的值是一个 Promise 实例，直接返回它
    if (value instanceof Promise) {
      return value;
    }

    // 如果传入的值是一个 thenable 对象（具有 then 方法的对象）
    if (value !== null && typeof value === "object" && typeof value.then === "function") {
      return new Promise(function (resolve, reject) {
        value.then(resolve, reject);
      });
    }

    // 否则返回一个以该值为成功状态的 Promise
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  });

  define(Promise, "reject", function (reason) {
    return new Promise(function (resolve, reject) {
      reject(reason);
    });
  });

  define(Promise, "all", function (promises) {
    // 校验集合的合法性
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");

    // 如果传递的是Set结构，则把其变为数组
    if (toString.call(promises) === "[object Set]") promises = Array.from(promises);

    return new Promise(function (resolve, reject) {
      var len = promises.length,
        // 存储成功的值
        results = [],
        i = 0,
        // 计数器
        n = 0,
        promise;

      // 空数组时直接resolve一个空数组
      if (len === 0) {
        return resolve("数组中没有promise实例");
      }

      // 循环迭代集合中的每一项，验证每一项的成功和失败
      for (; i < len; i++) {
        // promise.then异步操作
        (function (i) {
          promise = promises[i];
          // 验证每一项是否是promise实例
          if (!isPromise(promise)) promise = Promise.resolve(promise);
          promise.then(function onfulfilled(value) {
            // 某一项是成功，我们把值存起来「按顺序存储」，继续看下一项
            results[i] = value;
            n++;
            if (n >= len) {
              // 都成功了，则整体也是成功
              resolve(results);
            }
          }, function onrejected(reason) {
            // 其中有一项是失败，则整体就是失败
            reject(reason);
          });
        })(i);
      }
    });
  });

  define(Promise, "any", function (promises) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");
    if (toString.call(promises) === "[object Set]") promises = Array.from(promises);

    return new Promise(function (resolve, reject) {
      var len = promises.length,
        n = 0;

      // 空数组时直接reject
      if (len === 0) {
        return reject(new Error("All promises were rejected"));
      }

      [].forEach.call(promises, function (promise, index) {
        if (!isPromise(promise)) promise = Promise.resolve(promise);
        promise.then(function onfulfilled(value) {
          resolve(value)
        }, function onrejected(reason) {
          if (++n >= len) reject(new Error("All promises were rejected"));
        });
      });
    });
  });

  define(Promise, "race", function (promises) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");
    if (toString.call(promises) === "[object Set]") promises = Array.from(promises);

    return new Promise(function (resolve, reject) {
      var len = promises.length;
      for (var i = 0; i < len; i++) {
        var promise = promises[i];
        if (!isPromise(promise)) promise = Promise.resolve(promise);
        promise.then(resolve, reject);
      }
    });
  });

  // 对all重写，需要满足失败的条件后，才会失败
  define(Promise, "allLimit", function (promises, limit) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");
    if (toString.call(promises) === "[object Set]") promises = Array.from(promises);
    limit = +limit;
    if (isNaN(limit)) limit = 1;
    return new Promise(function (resolve, reject) {
      var len = promises.length,
        // 成功的数量
        n = 0,
        // 失败的数量
        m = 0,
        results = [];
      [].forEach.call(promises, function (promise, index) {
        if (len === 0) {
          return resolve("数组中没有promise实例");
        }
        if (!isPromise(promise)) promise = Promise.resolve(promise);
        promise.then(function onfulfilled(value) {
          results[index] = value;
          if (++n >= len) resolve(results);
        }, function onrejected(reason) {
          // 失败也要计数
          if (++m >= limit) {
            reject(new Error("There have been " + limit + " failures!"));
          } else {
            // 当不满足失败的数量的时候，也要让成功的计数并赋值为失败的原因
            results[index] = `失败=>${reason}`;
            // 如果最后一项也不没有达到失败的次数，则返回成功
            if (++n >= len) resolve(results);
          }
        });
      });
    });
  });

  /* 暴露API */
  // window存在，说明是浏览器环境
  if (typeof window !== "undefined") window.Promise = Promise;
  // 支持CommonJS规范
  if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();