(function () {
  // 自定义事件池
  let listeners = {};

  // 校验的处理
  const checkName = name => {
    if (typeof name !== "string") throw new TypeError('name is not a string!');
  };
  const checkFunc = func => {
    if (typeof func !== "function") throw new TypeError('func is not a function!');
  }

  // 向事件池中加入方法
  const on = function on(name, func) {
    checkName(name);
    checkFunc(func);
    // 判断事件池中是否存在这个事件
    if (!listeners.hasOwnProperty(name)) listeners[name] = [];
    let arr = listeners[name];
    // 去重处理
    if (arr.indexOf(func) >= 0) return;
    arr.push(func);
  }

  // 从事件池中移除方法
  const off = function off(name, func) {
    checkName(name);
    checkFunc(func);
    let arr = listeners[name];
    // 如果事件池中没有这个方法则不移除
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item === func) {
        // 把这一项移除掉:为了避免数组塌陷问题，先赋值为null
        arr[i] = null;
        break;
      }
    }
  };

  // 通知指定事件池中的方法执行
  const emit = function emit(name, ...params) {
    checkName(name);
    let arr = listeners[name];
    // 如果事件池中没有这个方法则不通知
    if (!arr) return;
    // 通知集合中的每个方法执行
    for(let i = 0; i < arr.length; i++){
      let item = arr[i];
      // 如果事件池中的方法为null，就移除方法
      if(item === null) {
        arr.splice(i, 1);
        i--;
        continue;
      }      
      item(...params);
    }
  };

  // 暴露API
  window.$sub = {
    on,
    off,
    emit
  };
})();

/* 测试 */
const fn1 = (x, y) => {
  console.log('fn1', x, y);
}
// 第一次执行到fn2的时候，从事件池中移除fn1,fn2
const fn2 = (x, y) => {
  console.log('fn2', x, y);
  $sub.off('AA', fn1);
  $sub.off('AA', fn2);
}
const fn3 = () => console.log('fn3');
const fn4 = () => console.log('fn4');
const fn5 = () => console.log('fn5');
const fn6 = () => console.log('fn6');

/* 把6个方法加入到事件池中 */
$sub.on('AA', fn1);
$sub.on('AA', fn2);
$sub.on('AA', fn3);

// 不允许在事件池同一个事件名字中添加相同的方法
$sub.on('AA', fn2);
$sub.on('AA', fn3);

$sub.on('AA', fn4);
$sub.on('AA', fn5);
$sub.on('AA', fn6);

$sub.on('BB', fn1);
$sub.on('BB', fn2);

// 2S之后通知事件池中事件名为AA的事件执行
// 输出fn1-fn6
setTimeout(() => {
  $sub.emit('AA', 10, 20);
  // 再过2S后通知事件执行
  // 第一次移除了fn1/fn2，输出fn3-fn6
  setTimeout(() => {
    $sub.emit('AA', 100, 200);
  }, 2000);
}, 2000);