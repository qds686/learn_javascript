// 设置状态
const PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED';

// xx.then执行之前检查this是不是 MyPromise 实例
const checkInstance = (self) => {
  if (!(self instanceof MyPromise)) {
    throw new TypeError('Method called on incompatible receiver #<MyPromise>');
  }
}

// 处理then方法返回的新实例promise的状态和值
// promise:新实例 x:onfulfilled/onrejected执行的返回值 
// resolve & reject：控制成功和失败
// promise的成功和失败取决于x
const resolvePromise = (promise, x, resolve, reject) => {

  if (x === promise) throw new TypeError("Chaining cycle detected for promise #<Promise>");

  // x是对象或函数，不一定是promise实例
  if (x !== null && /^(object|function)$/.test(typeof x)) {
    let then;
    try {
      then = x.then;
    } catch (err) {
      // 获取then方法的时候 可能劫持报错
      reject(err);
      return;
    }

    if (typeof then === "function") {
      // x是一个promise实例了，相当于x.then()

      // 只能执行一个函数，防止两个函数同时执行
      let called = false;

      try {
        then.call(x, (y) => {
          if (called) return;
          called = true;

          // return Promise.resolve(Promise.reject(-1)); 虽然是成功的，但是返回的promise实例的值可能还是promise实例
          resolvePromise(promise, y, resolve, reject);
        }, (r) => {
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

// 验证是否为promise实例
const isPromise = (x) => {
  if (x != null && /^(object|function)$/.test(typeof x)) {
    let then;
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

// isIterator：验证传递的值是否是符合ITerator迭代器规范
const isIterator = (obj) => {
  // 数组本身是可迭代对象
  if (Array.isArray(obj)) return true;
  // null/undefined直接返回false
  if (obj == null) return false;
  // 检查是否有Symbol.iterator方法（需判断类型为函数）
  if (typeof Symbol !== "undefined" && typeof obj[Symbol.iterator] === "function") {
    return true;
  }
  // 其他情况（如普通对象）返回false
  return false;
}

class MyPromise {
  // Promise执行会生成私有属性和公有属性
  // 私有属性：PromiseState/PromiseResult
  constructor(executor) {
    //存储this指向
    const self = this;

    // init params
    // 4个私有属性
    self.state = PENDING;
    self.result = undefined;

    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    // 如果executor不是函数报错
    if (typeof executor !== 'function') throw new TypeError('Promise resolver is not a function');

    // 不使用new执行 ES6的类 会优先抛出错误
    // Uncaught TypeError: Class constructor MyPromise cannot be invoked without 'new'
    // 如果不是ES6 class定义的类 这个自定义的错误会执行
    if (!(self instanceof MyPromise)) throw new TypeError("undefined is not a promise");

    // 传递状态和值，改变实例的状态和值
    const change = (state, result) => {
      // state是PENDING状态的时候才会修改为成功或者失败状态
      // 如果修改为成功或者失败状态则不会再变为其他状态
      if (self.state !== PENDING) return;
      self.state = state;
      self.result = result;

      // 异步通知集合中的方法执行
      let callbacks = self.state === FULFILLED
        ? self.onFulfilledCallbacks
        : self.onRejectedCallbacks;

      if (callbacks.length > 0) {
        setTimeout(() => {
          callbacks.forEach(callback => {
            callback(self.result);
          });
        });
      }
    };

    const resolve = (value) => {
      // 如果executor函数中resolve了一个新的promise实例要再次递归解析
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
        return;
      }

      change(FULFILLED, value);
    };

    const reject = (reason) => {
      change(REJECTED, reason);
    };

    /* 
    new Promise((resolve, reject)=> {})
    1.new Promise 会立即执行executor函数
    2.会传递两个参数resolve 和 reject，参数也是函数
    3.resolve把实例的状态改为fulfilled，reject把实例的状态改为rejected
      + 有三种情况：resolve、reject、函数内部报错「状态自动变为reject」
    4.一旦状态被修改为fulfilled或者rejected，后期就不会再更改状态值了
    */
    try {
      executor(resolve, reject);
    } catch (err) {
      change(REJECTED, err);
    }
  }

  /* 实例的共有方法 */

  // => onFulfilled 和 onRejected 函数内部不能使用this
  then(onFulfilled, onRejected) {
    // 判断调用then的实例是否是类的实例
    checkInstance(this);

    // 保证此时this就是Promise的实例
    const self = this;
    // then中返回的新实例
    let promise2;

    // 链穿透机制：正确实现
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason; };

    /* 
      x.then
      => 执行then方法，会返回一个全新的Promise
        executor执行先看有没有报错，报错reject执行，
        没有报错接收返回值，看是不是 Promise实例/普通值
    */
    promise2 = new MyPromise((resolve, reject) => {

      // => 判断实例状态，执行then中的方法
      //   每个状态执行的时候是异步的
      //   宏任务「macro-task」 setTimeout/setImmediate 
      //   微任务「micro-task」 MutotionObserver/process.nextTick
      // => 实例多次调用then方法，依次会执行每一个then中的两个参数函数，不会跳过第一个，执行其他的参数
      switch (self.state) {
        case FULFILLED:
          setTimeout(() => {
            try {
              let x = onFulfilled(self.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          break;
        case REJECTED:
          setTimeout(() => {
            try {
              let x = onRejected(self.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          break;
        default:
          // state此时的值是 "pending", 不知道实例的状态
          // 先把要执行的方法存储到实例上，等待知道状态的时候再通知执行
          // 在change方法中异步通知集合中的方法执行
          self.onFulfilledCallbacks.push(() => {
            try {
              let x = onFulfilled(self.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          self.onRejectedCallbacks.push(() => {
            try {
              let x = onRejected(self.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
      }
    });

    // => 返回promise实例实现链式调用then
    return promise2;
  }

  // p.catch(err => xx);
  // errorCallback 是用户调用的时候传入的错误回调函数
  catch(errorCallback) {
    checkInstance(this);
    var self = this;
    return self.then(null, errorCallback);
  }

  // 1.不管外面的promise成功或者失败都会执行finally，并且回调函数不带参数
  // 2.正常走finally之后的then或者catch =>this.then
  // 3.如果finally内部有promise，并且有延时处理，整个finally会等待 => MyPromise.resolve
  // => 有失败先取失败，都为失败，里面优先，都成功，外面优先
  // 4.如果两个都是成功，取外面的结果(成功)
  // 5.如果外面是成功，里面是失败，取里面的结果(失败)
  // 6.如果外面是失败，里面是成功，取外面的结果(失败)
  // 7.如果外面是失败，里面是失败，取里面的结果(失败)

  // finallyCallback 用户使用时传递的回调函数
  finally(finallyCallback) {
    return this.then((value) => {
      return MyPromise.resolve(finallyCallback()).then(() => value);
    }, (reason) => {
      return MyPromise.resolve(finallyCallback()).then(() => {
        throw reason;
      });
    });
  }

  /* 类的静态私有属性：把promsie当做普通对象 */

  // “将一个值 / 对象标准化为 Promise 实例”—— 无论输入是普通值、Promise 实例还是类 Promise 对象（thenable），最终都返回一个确定状态的 Promise
  static resolve(value) {
    // 如果传入的值是一个 Promise 实例，直接返回它
    // 避免重复包装 —— 如果输入已经是当前实现的 Promise 实例，无需创建新实例，直接返回原实例即可（保证引用一致性）
    if (value instanceof MyPromise) {
      return value;
    }

    // 如果传入的值是一个 thenable 对象（具有 then 方法的对象）
    // 若输入是 thenable 对象，包装为 Promise 并解析
    // 等待 value 的状态确定后，同步新实例的状态。
    if (value !== null && typeof value === "object" && typeof value.then === "function") {
      return new MyPromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    }

    // 否则返回一个以该值为成功状态的 Promise
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  // 返回一个失败状态的promise
  static reject(error) {
    return new MyPromise((resolve, reject) => {
      reject(error);
    });
  }

  /* 
   用于并行处理多个异步操作，并在 "所有操作都成功完成" 后返回结果。如果其中任何一个操作失败，它会立即返回失败状态。
   
   返回值：一个新的 Promise 实例，状态由所有输入 Promise 的状态共同决定：
     + 当所有输入 Promise 都变为 fulfilled（成功），返回的 Promise 变为 fulfilled，结果是所有成功值组成的数组（顺序与输入一致）。
     + 当任一输入 Promise 变为 rejected（失败），返回的 Promise 立即变为 rejected，结果是第一个失败的原因。
  */
  static all(promises) {
    // 校验集合的合法性
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");

    // 如果传递的是Set结构，则把其变为数组
    if (Object.prototype.toString.call(promises) === "[object Set]") promises = Array.from(promises);

    return new MyPromise((resolve, reject) => {
      let len = promises.length,
        // 存储成功的值
        results = [],
        // 计数器
        n = 0;

      // 空数组时直接resolve一个空数组，这里做了说明
      if (len === 0) {
        // "数组中没有promise实例"
        return resolve(results);
      }

      promises.forEach((promise, index) => {
        // 验证每一项是否是promise实例
        if (!isPromise(promise)) promise = MyPromise.resolve(promise);

        promise.then((value) => {
          // 某一项是成功，我们把值存起来「按顺序存储」，继续看下一项
          results[index] = value;
          n++;
          if (n >= len) {
            // 都成功了，则整体也是成功
            resolve(results);
          }
        }, (reason) => {
          // 其中有一项是失败，则整体就是失败
          reject(reason);
        });
      });
    });
  }

  // 核心作用是等待多个异步操作中 “第一个成功” 的操作。
  // 返回值：任意一个promise成功则成功，结果是这个成功的值，所有失败则整体失败，结果是一个 AggregateError（包含所有失败原因的错误对象）
  // any对失败免疫，race会被第一个失败打断
  static any(promises) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");
    if (Object.prototype.toString.call(promises) === "[object Set]") promises = Array.from(promises);

    return new MyPromise((resove, reject) => {
      let len = promises.length,
        // 失败计数器：记录已失败的Promise数量
        n = 0;

      // 空数组时直接reject
      if (len === 0) {
        return reject(new AggregateError([], "All promises were rejected"));
      }

      promises.forEach((promise, index) => {
        if (!isPromise(promise)) promise = MyPromise.resolve(promise);

        promise.then((value) => {
          resolve(value);
        }, (reason) => {
          // 记录失败次数，全失败才rejected
          // ES2021新增 全失败：返回AggregateError，包含所有原因
          if (++n >= len) reject(new AggregateError(errors, "All promises were rejected"));
        });
      });
    });
  }

  // 根据第一个改变状态的promise元素决定成功或者失败
  // “竞速”：超时问题，优先选择缓存数据问题
  // 空数组永远pending不处理
  static race(promises) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");

    // 支持所有可迭代对象
    promises = Array.isArray(promises) ? promises : Array.from(promises);

    return new MyPromise((resolve, reject) => {
      let len = promises.length;

      for (let i = 0; i < len; i++) {
        let promise = promises[i];
        if (!isPromise(promise)) promise = MyPromise.resolve(promise);
        promise.then(resolve, reject);
      }
    });
  }

  // 对all重写，需要满足失败的条件后，才会失败，同时控制并发数量
  // promises: 可迭代对象的数组 failureLimit：控制失败数量 concurrencyLimit：控制并发数量
  // 如果不需要并发控制，直接可以用 forEach一次执行Promise
  static allLimit(promises, failureLimit, concurrencyLimit) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");

    promises = Array.isArray(promises) ? promises : Array.from(promises);

    // 参数校验
    let limit = +failureLimit;
    if (isNaN(limit) || limit < 1) limit = 1;

    let conLimit = +concurrencyLimit;
    if (isNaN(conLimit) || conLimit < 1) conLimit = 1;

    return new MyPromise((resolve, reject) => {
      const len = promises.length;
      // 用固定长度数组存储结果，确保索引与任务顺序一致
      const results = new Array(len);
      let completed = 0; // 所有完成的任务数（成功+未达限制的失败）
      let failedCount = 0; // 失败任务数
      let curIdx = 0; // 当前任务的索引
      let isRejected = false; // 标记是否已触发整体拒绝

      if (len === 0) {
        return resolve(results);
      }

      const runTask = () => {
        // 终止条件：所有任务处理完毕或已拒绝
        if (curIdx >= len || isRejected) return;

        const taskIndex = curIdx++;
        let task = promises[taskIndex];

        // 标准化非Promise任务
        if (!isPromise(task)) {
          task = MyPromise.resolve(task);
        }

        task.then(
          (value) => {
            results[taskIndex] = value;
            completed++;

            // 所有任务完成时触发resolve
            if (completed === len) {
              resolve(results);
            } else {
              // 继续执行下一个任务，维持并发量
              runTask();
            }
          },
          (reason) => {
            failedCount++;
            if (failedCount >= limit) {
              isRejected = true;
              reject(new Error(`There have been ${limit} failures!`));
              return; // 阻止后续执行
            }

            // 记录失败结果
            results[taskIndex] = `失败=>${reason}`;
            completed++;

            // 所有任务完成时触发resolve
            if (completed === len) {
              resolve(results);
            } else {
              runTask();
            }
          }
        );
      };

      // 初始化并发任务
      const initTasks = Math.min(conLimit, len);
      for (let i = 0; i < initTasks; i++) {
        runTask();
      }
    });
  }

  // 用于处理多个"异步操作"并等待所有操作完成「注重结果完整性，而非全成功」，无论它们是成功还是失败
  // 1.参数 iterable：可迭代对象（如数组），其中的元素通常是 Promise 实例
  // 2.返回值：一个新的 Promise 实例，该实例始终会fulfilled（不会 reject），其结果是一个数组，数组中的每个元素对应原可迭代对象中每个 Promise 的最终状态和结果
  // 3.与 Promise.all() 不同，它不会会因为某个操作失败而立即 reject，而是会等待所有操作都 “尘埃落定”（settled）后，返回一个包含所有操作结果的数组。
  // 4.[{status: "fulfilled", value: <成功的结果>},{status: "rejected", reason: <失败的原因>}]
  static allSettled(promises) {
    if (!isIterator(promises)) throw new TypeError("promises is not iterable");

    if (toString.call(promises) === "[object Set]") promises = Array.from(promises);

    return new MyPromise((resolve, reject) => {
      let len = promises.length,
        results = [],
        n = 0;

      // 原生中返回空数组，此处做了说明
      if (len === 0) {
        // "数组中没有promise实例"
        return resolve([]);
      }

      promises.forEach((promise, index) => {
        if (!isPromise(promise)) promise = MyPromise.resolve(promise);

        promise.then((value) => {
          formatResult('fulfilled', value, index);
        }, (reason) => {
          formatResult('rejected', reason, index);
        });
      });

      const formatResult = (status, value, index) => {
        results[index] = status === "fulfilled" ? { status, value } : { status, reason: value };

        // switch (status) {
        //   case 'fulfilled':
        //     results[index] = {
        //       status,
        //       value
        //     }
        //     break;
        //   case 'rejected':
        //     results[index] = {
        //       status,
        //       reason: value
        //     }
        //     break;
        //   default:
        //     break;
        // }

        if (++n >= len) {
          resolve(results);
        }
      }
    });
  }
}

// 可迭代
if (typeof Symbol !== "undefined") {
  MyPromise.prototype[Symbol.toStringTag] = "Promise";
}

// 测试默认支持CommonJS规范
MyPromise.defer = MyPromise.deferred = function () {
  let deferred = {};

  deferred.promise = new MyPromise((resolve, rejected) => {
    deferred.resolve = resolve;
    deferred.reject = rejected;
  });

  return deferred;
}

module.exports = MyPromise;

// finally
/* MyPromise.resolve('promise success').finally(() => {
  console.log('finally');

  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      // resolve('new Promise success');
      reject('new Promise error');
    }, 2000);
  })
}).then((res) => {
  console.log('success:' + res);
}).catch((err) => {
  console.log('error:' + err);
}); */

// resolve
/* // 传入一个普通值
let p1 = MyPromise.resolve(42);
p1.then(value => {
  console.log(value); // 输出：42
});

// 传入一个 MyPromise 实例
let p2 = MyPromise.resolve(MyPromise.resolve(42));
p2.then(value => {
  console.log(value); // 输出：42
});

// 传入一个 thenable 对象
let thenable = {
  then: function (resolve, reject) {
    resolve(42);
  }
};
let p3 = MyPromise.resolve(thenable);
p3.then(value => {
  console.log(value); // 输出：42
});

// 可以传入一个异步成功的MyPromise实例
MyPromise.resolve(new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('盒子');
  }, 2000);
}))
  .then(res => {
    console.log(res); // 盒子
  })
  .catch(err => {
    console.log(err);
  }); */

// reject
// let p1 = MyPromise.reject("出错了");
// p1.catch(reason => {
//   console.log("失败:", reason); // 输出：失败: 出错了
// });

// MyPromise.reject(new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject('不是盒子');
//   }, 2000);
// })).catch(err => {
//   console.log(err); // 立即返回一个失败的Promise实例，不会解析，也不会等待
// });

// all
// let p1 = Promise.resolve(1);
// let p2 = new Promise(resolve => {
//   setTimeout(() => {
//     resolve(2);
//   }, 2000);
// });
// let p3 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve(3);
//     reject(3);
//   }, 1000);
// });
// let p4 = 4; // => Promise.resolve(4)

// let p = Promise.all([p1, p2, p3, p4]);
// p.then(values => {
//   console.log(`成功：${values}`); // p3成功，2S后输出 成功：1,2,3,4
// }).catch(reason => {
//   console.log(`失败：${reason}`); // p3失败，1S后输出 失败：3
// });
// ==========

// let p = Promise.all([]);
// p.then(values => {
//   console.log(`成功：${values}`); // 成功：数组中没有promise实例
// }).catch(reason => {
//   console.log(`失败：${reason}`);
// });

// any
/* let p1 = Promise.resolve(1);
let p2 = new Promise(resolve => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(3);
    reject(3);
  }, 1000);
});
let p4 = 4;

// let p = Promise.any([p2, p3]);
// p.then(values => {
//   console.log(`成功：${values}`); // 成功：2
// }).catch(reason => {
//   console.log(`失败：${reason}`);
// });

// let p = Promise.any([p3]);
// p.then(values => {
//   console.log(`成功：${values}`);
// }).catch(reason => {
//   console.log(`失败：${reason}`); // 失败：Error: All promises were rejected
// });

let p = Promise.any([]);
p.then(values => {
  console.log(`成功：${values}`);
}).catch(reason => {
  console.log(`失败：${reason}`); // 失败：Error: All promises were rejected
}); */

// race
/* let p1 = MyPromise.resolve(1);
let p2 = new MyPromise(resolve => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});
let p3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve(3);
    reject(3);
  }, 1000);
});
let p4 = 4;

let p = MyPromise.race([p1, p2, p3, p4]);
p.then(values => {
  console.log(`成功：${values}`); // 成功：1
}).catch(reason => {
  console.log(`失败：${reason}`);
}); */

// allLimit
/* let p1 = MyPromise.resolve(1);
// let p1 = MyPromise.reject(1);
let p2 = new MyPromise(resolve => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});
let p3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve(3);
    reject(3);
  }, 1000);
});
let p4 = 4;

let p = MyPromise.allLimit([p1, p2, p3, p4], 2, 2);
p.then(values => {
  console.log(`成功：${values}`); // 只有p3为失败，还是返回成功 => 成功：1, 2, 失败=>3, 4
}).catch(reason => {
  console.log(`失败：${reason}`); // p1 p3为失败，则返回=> 失败：Error: There have been 2 failures!
}); */

// allSettled
// const promise1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('success');
//   }, 1000);
// });

// const promise2 = new MyPromise((resolve, reject) => {
//   reject('error');
// });

// MyPromise.allSettled([promise1, promise2]).then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err);
// });

// 顺序交换
// MyPromise.allSettled([promise2, promise1]).then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err);
// });

// 顺序交换
// MyPromise.allSettled(undefined).then((res) => {
//   console.log(res); // [错误对象，成功对象]
// }).catch((err) => {
//   console.log(err);
// });

// 测试
/* let promise = new MyPromise((resolve, reject) => {
  resolve(1); // 初始实例成功，值为 1
})
  .then((val) => {
    console.log(val); // 输出：1（第一个 then 的成功回调）
    // 此处resolvePromise执行两次，第一次，这个返回值解析，第二次对解析完成的1再次查看
    return Promise.resolve(1); // 返回原生 Promise 实例（成功，值为 1）
  });

promise.then(
  (val) => {
    console.log(val); // 输出：1（第二个 then 的成功回调，获取到原生 Promise 的值）
  },
  (err) => {
    console.log(err); // 不执行
  }
); */
