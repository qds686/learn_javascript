// 1
/* 
微1：promise状态是成功，则放到微任务队列中等待
宏1：执行setTimeout，等待5-7MS后执行
同步执行完毕，执行微任务队列中的微1任务 输出p1 & 宏2
按顺序执行宏任务队列中的宏1任务 输出s1 & 微2
微2成功放到队列执行 输出p2
宏2成功放到队列执行 输出s2
=> p1 s1 p2 s2
*/

// 微1
Promise.resolve().then(() => {
  console.log('p1');

  setTimeout(() => {
    console.log('s2');
  }, 0);
});

// 宏1
setTimeout(() => {
  console.log('s1');

  Promise.resolve().then(() => {
    console.log('p2');
  });
}, 0);

// 2
// 1 3 4 6 5 2
console.log(1);

setTimeout(() => {
  console.log(2);
}, 10);

new Promise((resolve, reject) => {
  console.log(3);
  resolve('');
  console.log(4);
}).then(() => {
  console.log(5);
});
console.log(6);

// 3
// 1 5 8 3 6 2
var promise = new Promise(resolve => {
  console.log(1);
  resolve();
});
setTimeout(() => {
  console.log(2);
}, 0);
promise.then(() => {
  console.log(3);
});
var promise2 = getPromise();
async function getPromise() {
  console.log(5);
  await promise;
  console.log(6);
}
console.log(8);

// 4

const LazyMan = function (name){
  console.log(`Hi i am ${name}`);
  function _eat(food){
    console.log(`I am eating ${food}`);
  }
  const callbacks = [];
  class F {
    sleep(timeout) {
      setTimeout(function () {
        console.log(`等待了${timeout}秒...`);
      }, timeout);
      return this;
    }

    eat(food) {
      callbacks.push(() => _eat.bind(null,food));
      return this;
    }
  }
  return new F();
};
LazyMan('Tony').sleep(1000).eat('lunch');







