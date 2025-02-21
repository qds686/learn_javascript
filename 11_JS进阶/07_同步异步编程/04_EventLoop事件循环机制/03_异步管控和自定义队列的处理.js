/* 
实现一个LazyMan，可以按照以下方式调用：
LazyMan("Hank") 输出：
Hi! This is Hank!

LazyMan("Hank").sleep(10).eat("dinner") 输出
Hi! This is Hank!
等待10秒...
Wake up after 10
Eat dinner~

LazyMan("Hank").eat("dinner").eat("supper") 输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMap("Hank").eat("supper").sleepFirst(5) 输出
等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
*/
class _LazyMan {
  constructor(name) {
    // 自定义异步队列
    this.listeners = [];

    // 最开始就要把输出“name”的操作加入队列
    this.push(() => {
      console.log(`Hi! This is ${name}!`);
    });

    // 同步执行完，异步通知队列中的方法执行
    // 等待中间所有同步代码执行完了，启动任务队列
    queueMicrotask(() => {
      this.run();
    });
  }

  eat(food) {
    this.push(() => {
      console.log(`Eat ${food}`);
    });
    return this;
  }

  // 向队列中加入休眠方法
  sleep(time, flag = false) {
    this.push(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`---Wake up after ${time}---`);
          resolve();
        }, time * 1000);
      });
    }, flag);
    return this;
  }

  sleepFirst(time) {
    this.sleep(time, true);
    return this;
  }

  // 向队列中加入任务
  push(task, isBegin = false) {
    let { listeners } = this;
    if (isBegin) {
      listeners.unshift(task);
      return;
    }
    listeners.push(task);
  }

  // 通知队列中的方法执行
  run() {
    let { listeners } = this,
      index = 0;
    const next = async () => {
      if (index >= listeners.length) return;
      const task = listeners[index++];
      // 当task执行成功后才能执行下一个
      // await自动把后面的代码变为Promise实例
      await task();
      // 递归执行
      next();
    };
    // 第一次执行
    next();
  }
}

const LazyMan = function LazyMan(name) {
  return new _LazyMan(name);
};

// LazyMan("Hank");
// LazyMan("Hank").sleep(3).eat("dinner")
// LazyMan("Hank").eat("dinner").eat("supper");
LazyMan("Hank").eat("supper").sleepFirst(3);