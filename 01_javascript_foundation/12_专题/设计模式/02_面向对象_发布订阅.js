(function () {
  class Sub {
    // 定义实例的私有事件池
    listeners = [];

    // 定义原型上通用的方法
    add(func) {
      if (typeof func !== "function") throw new TypeError("func is not a function");
      let { listeners } = this;
      if (listeners.includes(func)) return;
      listeners.push(func);
    }

    remove(func) {
      if (typeof func !== "function") throw new TypeError("func is not a function");
      // 私有变量listeners和this.listeners公用一个堆内存 => listeners = this.listeners
      let { listeners } = this;
      // map返回一个新的堆内存，会改变私有变量listeners的内存指向，修改私有变量实例的私有变量池不更新
      this.listeners = listeners.map(item => {
        if (item === func) {
          return null;
        }
        return item;
      });
    }

    fire(...params) {
      let { listeners } = this;
      for (let i = 0; i < listeners.length; i++) {
        let item = listeners[i];
        if (item === null) {
          // splice可以改变原始数组
          listeners.splice(i, 1);
          i--;
          continue;
        }
        item(...params);
      }
    }
  }

  /* 暴露API */
  if (typeof window !== "undefined") window.Sub = Sub;
  if (typeof module === "object" && typeof module.exports === "object") module.exports = Sub;

})();

/* 测试 */
const fn1 = (x, y) => {
  console.log('fn1', x, y);
}

// 第一次执行到fn2的时候，从事件池中移除fn1,fn2
const fn2 = (x, y) => {
  console.log('fn2', x, y);
  s1.remove(fn1);
  s1.remove(fn2);
}
const fn3 = () => console.log('fn3');
const fn4 = () => console.log('fn4');
const fn5 = () => console.log('fn5');
const fn6 = () => console.log('fn6');

let s1 = new Sub;
s1.add(fn1);
s1.add(fn2);
s1.add(fn3);
s1.add(fn4);
s1.add(fn5);
s1.add(fn6);

setTimeout(() => {
  s1.fire(10, 20);
  setTimeout(() => {
    s1.fire(100, 200);
  }, 2000);
}, 2000);





