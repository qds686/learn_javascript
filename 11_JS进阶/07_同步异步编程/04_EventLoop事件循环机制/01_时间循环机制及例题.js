/* 
浏览器是多线程的
  + GUI渲染线程：渲染和解析页面
  + JS引擎线程：渲染和解析JS「浏览器分配一个线程去解析JS，所以JS是单线程的」
  + 定时器监听线程
  + 事件监听线程
  + HTTP网络请求线程「同源下，浏览器最多同时分配5-7个HTTP线程」
  + ...

JS是单线程运行的，所以其中大部分代码都是“同步”的(例如：循环...)
  + 所以在JS中千万不要写“死循环、死递归”...等操作，这些操作会一直占用JS引擎线程，导致后续其他代码都无法执行
  + JS中有部分异步操作的代码
    [异步微任务] microTask
      + requestAnimationFrame
      + Promise.then/catch/finally
      + async/await
      + queueMicrotask 手动创建一个异步的微任务
      + MutationObserver：监听当前DOM元素属性值改变
      + IntersectionObserver：监听当前DOM元素和可视窗口交叉信息发生变化
      + nextTick「NodeJs process.nextTick」
      + ...
    [异步宏任务] macroTask
      + setTimeout/setInterval
        设置定时器是同步的过程，而“间隔[Interval]这么长时间后，触发绑定的方法执行”这个事情是异步的;
      + 事件绑定/队列
      + XMLHttpRequest/Fetch
      + setImmediate「Node」
      + MessageChannel
JS中的异步操作是：借用浏览器的多线程机制，再基于EventLoop事件循环机制，实现的单线程异步效果。
*/

// 1
setTimeout(() => {
  console.log(1);
}, 20);
console.log(2);
setTimeout(() => {
  console.log(3);
}, 10);
console.log(4);
// 在执行循环的时候，上面两个宏任务已经到时间，放到eventQueue中
for (let i = 0; i < 9000000; i++) {
  // do something AA: 79ms 左右
}
console.log(5);
// 
setTimeout(() => {
  console.log(6);
}, 8);
console.log(7);
setTimeout(() => {
  console.log(8);
}, 15);
console.log(9);
// 同步代码；2 4 5 7 9
// 异步宏任务；3 1 执行完宏任务，主线程空闲
// 执行webAPI中下一个宏任务 -> eventQueue -> 执行 6
// 执行webAPI中下一个宏任务 -> eventQueue -> 执行 8

/* Promise中的同步异步编程 */
/* 
情况1：p.then(onfulfilled,onrejected)
  + 已知实例P的状态和值，也不会把 onfulfilled/onrejected 执行，而是创建异步微任务 
  + 先进入webAPI中，发现状态是成功，则onfulfilled可以被执行，把其在挪至到EventQueue中排队等着
*/
// 输出：1、成功 10
let p = new Promise(resolve => {
  resolve(10);
});
p.then(value => {
  console.log('成功', value);
});
console.log(1);

/* 
情况2：如果还不知道实例p的状态
  + 先把onfulfilled/onrejected存储起来「理解为：进入WebAPI去监听，只有知道实例的状态，才可以执行」
  + resolve/reject执行，立即修改实例的状态和值，也决定了WebAPI中监听的方法(onfulfilled/onrejected)哪一个去执行，挪至到EventQueue(异步微任务队列)中，等待其他同步代码执行完，再拿出来执行
*/
// 输出：1、2、成功 10
let p = new Promise(resolve => {
  // 宏任务
  setTimeout(() => {
    resolve(10);
    console.log(2);
  }, 1000);
});
// 微任务
p.then(value => {
  console.log('成功', value);
});
console.log(1);

/* 
情况3：
*/
Promise.resolve(1)
  // 微任务1 -> WebAPI监听：看对应实例状态是否是成功，成功则直接放到EventQueue队列排队等待
  .then(value => {
    console.log('成功:', value);
    return 2; // resolve
  })
  // 微任务2 -> WebAPI监听：等待P2的状态是成功，才可以执行，只有微任务1执行的返回值决定微任务2的状态
  .then(value => {
    console.log('成功:', value);
  });
// 同步执行完毕，执行微任务1：成功 1
// 微任务1执行完毕后微任务2的状态为成功，则放到事件队列中执行：返回：成功: 2

/* async/await 
遇到await
  + 会立即执行其后面的代码，看返回的promise实例 (如果不是promise实例也会变为promises实例) 是否成功
  + 会把当前上下文中，await下面代码当做异步的微任务
    + 进入到WebAPI中去监听：只有后面实例的状态是成功的，才可以执行
    + 可执行则进入到EventQueue中排队等待
*/
const fn = async () => {
  console.log(1);
  return 10;
};
(async function () {
  // 先执行后面的代码 fn，输出1，返回状态成功，值是10的实例
  let result = await fn();
  // 当前上下文后面的生成微任务
  // WebAPI监听到 “await后面的实例” 返回为成功 -> 放到EventQueue中排队等待
  console.log(2, result);
})();
console.log(3);
// 1、3、微任务=>2 10

// 练习题
// 1
console.log('start');
let intervalId;
Promise.resolve().then(() => {
  console.log('p1');
}).then(() => {
  console.log('p2');
});
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log('p3');
  }).then(() => {
    console.log('p4');
  });
  intervalId = setInterval(() => {
    console.log('interval');
  }, 3000);
  console.log('timeout1');
}, 0);

// 2
setTimeout(() => {
  console.log('a');
});
Promise.resolve().then(() => {
  console.log('b');
}).then(() => {
  return Promise.resolve('c').then(data => {
    setTimeout(() => {
      console.log('d');
    });
    console.log('f');
    return data;
  });
}).then(data => {
  console.log(data);
});

// 3
function func1() {
  console.log('func1 start');
  return new Promise(resolve => {
    resolve('OK');
  });
}
function func2() {
  console.log('func2 start');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('OK');
    }, 10);
  });
}
console.log(1);
setTimeout(async () => {
  console.log(2);
  await func1();
  console.log(3);
}, 20);
for (let i = 0; i < 9000000; i++) {
  //循环大约要进行80ms左右
}
console.log(4);
func1().then(result => {
  console.log(5);
});
func2().then(result => {
  console.log(6);
});
setTimeout(() => {
  console.log(7);
}, 0);
console.log(8);









