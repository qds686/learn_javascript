/* 
Promise: ES6新增的内置类(构造函数)
  @1 Promise的作用
    + 用来规划异步编程代码，解决回调地狱等问题
      + Ajax中的“串行”&“并行”：多个ajax请求的管理模式
      + 串行：一般是多个请求之间存在依赖(例如:当前请求需要用到上一个请求获取的结果)，此时我们只能等待上一个请求成功，才能发送下一个请求...
        + JQ中请求永远在上一个回调函数中写回调函数，这样就构成回调地狱
      + 并行：多个请求之间没有依赖，可以同时发送，谁先请求回来，就先处理谁
  @2 new Promsie时候，传递的executor函数的细节知识点
    let p1 = new Promise([executor])
    + [executor]必须是一个函数，而且 new Promise的时候会立即把其执行，同步操作
    + p1是创建出来的"实例" 「当做构造函数分析」
      私有属性
      + [[PrimiseState]]: "pending/fulfilled/rejected"  实例的状态
      + [[PromiseResult]]: undefined 实例的值「成果的结果或者失败的原因」
      公共方法：Promise.prototype
      + then
      + catch
      + finally
  @3 then/catch/finally的语法
    + p1.then([onfulfilled], [onrejected])
      + onfulfilled/onrejected都是函数
      + 实例状态是成功fulfilled的时候，会把onfulfilled执行，把实例的值作为成功的结果传递给它
      + 实例状态是失败rejected的时候，会把onrejected执行，把实例值作为失败的原因传递给它
    + Promise.then([onfulfilled]).then([onfulfilled]).catch([rejected]);
    + Promise.then([onfulfilled]).then([onfulfilled]).catch([rejected]).finally(()=>{})
      + 不论成功还是失败，最后都要执行finally中的方法「一般不用」
*/

/* 
创建promise实例的N种方案「包含如何修改实例的状态和值」
  @1 基于这种方式创建实例
    let p = new Promise((resolve, reject)=> {})
    + 如果executor函数执行报错，则把实例的状态修改为rejected，值是报错原因
    + resolve/reject是函数
      resolve('ok') -> 把实例P的状态修改为fulfilled，值(成功结果)是'ok'
      reject('no') -> 把实例P的状态修改为rejected，值(失败原因)是'no'
    + 一旦状态被修改为fulfilled或者rejected，后期就不会再更改状态值了
  @2 每一次执行then方法，都会返回一个“全新的Promise实例”
    let p2 = p1.then(onfulfilled,onrejected)
    不论是onfulfilled还是onrejected执行(由p1状态来决定),方法的执行决定了p2的状态和值
    + 首先看方法执行是否报错，如果报错了，则p2是失败态(rejected)，值是报错原因
    + 如果执行不报错，再看方法的返回值
      + 如果实例状态是pending，则两个函数暂时都不执行
      + 如果返回的是新的“Promise实例”，则新的Promise的状态和值直接决定了p2的状态和值
        + 如果状态是成功fulfilled，则执行[onfulfilled]
        + 如果状态是失败rejected，则执行[onrejected]
      + 如果返回的不是新实例，则p2状态是成功(fulfilled),值是函数的返回值
  @3 执行Promise.resolve/reject/all/any/race...等静态私有方法，也会创建新的Promise实例「当做普通对象分析」
    + Promise.resolve(10) 创建一个状态是成功fulfilled，值是10 的实例
    + Promise.reject(0) 创建一个状态是失败rejected，值是0的实例
  @4 Promise.all/any/race([promises])
    + let p = Promise.all([promises])
      + promises是包含零到多个Promise实例的集合，一般是数组，也可以是符合iterator规范的语法机制，如果集合中的某一项，不是Promise实例，则默认变为状态为成功，值是本身的Promise实例
      + all：集合中的 "每个实例都为成功"，最后结果P才是成功，值是按照集合顺序，依次存储每个实例成功结果的数组;其中只要有一个实例失败，则P就是失败的，值是本次失败的原因，后面的操作不再处理！！
      + any：只要有一个成功，最后P就是成功的，值是本次成功的结果；都失败，最后P才失败！，兼容性不好
      + race：集合中谁最先知道结果，则以谁的为主！
  @5 基于async修饰函数
*/

/* 
THEN链的穿透和顺延机制
  .then(onfulfilled,onrejected) 两个方法可以传也可以不传，如果不传，则顺延至下一个THEN中，相同状态要执行的方法中去处理！！
  + 原理：我们不设置对应的方法，Promise内部会默认加一个对应的方法，可以让其实现状态的顺延/穿透
  ----
  p.catch(onrejected) 等价于 p.then(null,onrejected)
  + 真实项目中，一般then中只传递onfulfilled，在最末尾设置.catch(也就是onrejected)
  + 好处：then中只处理状态为成功要做的事情，不论在何时遇到失败的实例，最后都会顺延至最后一个catch中进行处理
*/

// 方案一
// let p1 = new Promise((resolve, reject) => {
//   // 函数执行修改状态和值
//   /* fulfilled */
//   // resolve('ok');

//   resolve(10);
//   console.log(a);

//   /* rejected */
//   // reject('no');

//   // throw new Error('xxx');
// });

// let p2 = p1.then(value => {
//   console.log('成功', value); // 'ok'
// }, reason => {
//   console.log('失败', reason); // 'no'
// });
// console.log(p2); //结果依次是 ok ok no no

// 方案二
// let p1 = new Promise((resolve, reject) => {
//   resolve(10);
// });

// let p2 = p1.then(value => {
//   // 实例.then执行的结果影响p2的结果
//   console.log('成功', value); // 成功 10
// }, reason => {
//   console.log('失败', reason); 
// });

// 方案三
// Promise.resolve(10)
//   .then(value => {
//     console.log('成功', value);  // 10
//     return Promise.reject(value / 10);
//   }, reason => {
//     console.log('失败', reason);
//     return Promise.reject(reason * 10);
//   }).then(value => {
//     console.log('成功', value);
//     return value + 10;
//   }, reason => {
//     console.log('失败', reason); // 失败 1
//     return reason - 10;
//   }).then(value => {
//     console.log('成功', value); // 成功 -9
//     return value + a; // 报错
//   }, reason => {
//     console.log('失败', reason);
//     return reason - a;
//   }).then(value => {
//     console.log('成功', value);
//   }, reason => {
//     console.log('失败', reason); // 失败 a is not defined
//   });

// 用法
let p1 = new Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 2000)
});
let p2 = new Promise(resolve => {
  setTimeout(() => {
    resolve(2)
  }, 2000);
});
let p3 = Promise.resolve(3);
let p4 = 4; // 默认变为 Promise.resolve(4)

// let p = Promise.all([p1, p2, p3, p4]);
// p.then(values => {
//   console.log(values); // 总体等3S之后按照顺序输出[1,2,3,4], 有一项失败，立刻输出失败
// }).catch(reason => {
//   console.log('失败', reason);
// });

// let p = Promise.any([p1, p2, p3, p4]);
// p.then(values => {
//   console.log(values); // 3
// }).catch(reason => {
//   console.log('失败', reason);
// });

// let p = Promise.race([p1, p2, p3, p4]);
// p.then(values => {
//   console.log(values); // 3
// }).catch(reason => {
//   console.log('失败', reason);
// });

// THEN链
// Promise.resolve(10)
//   .then(null/* value=>{
//       return 10;
//   } */, reason => {
//       console.log('失败', reason);
//     }).then(value => {
//       console.log('成功', value); // 成功 10
//     }, reason => {
//       console.log('失败', reason);
//     });

// Promise.reject(0)
//   .then(value => {
//     console.log('成功', value);
//   },/*,reason=>{
//     throw reason; 手动抛错误
//   }*/).then(value => {
//     console.log('成功', value);
//   }, reason => {
//     console.log('失败', reason); // 失败 0
//   });

// catch 真实项目中
// Promise.resolve(10)
//   .then(value => {
//     console.log('成功', value);
//     return value * 10;
//   })
//   .then(value => {
//     console.log('成功', value); // 成功 10
//     return value * 10;
//   })
//   .catch(reason => {
//     console.log('失败', reason);
//   });


// Promise解决了回调地狱
// JQ中的AJAX串行 
$.ajax({
  url: 'api1',
  success(result){
    console.log('第一个请求成功：',result);
    $.ajax({
      url: 'api1',
      success(result){
        console.log('第二个请求成功：',result);
        // ...
      }
    });
  }
});

axios.get('/api1')
  .then(value => {
    console.log('第一个请求成功', value);
    return axios.get('/api2');
  })
  .then(value => {
    console.log('第二个请求成功', value);
    return axios.get('/api3');
  });

// -----
// 需求：设置一个定时器，到时间干什么
setTimeout(() => {
  // ...
}, 1000);

// 改写
const sleep = (interval = 1000) => {
  return new PromiseRejectionEvent(resolve => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

sleep().then(()=>{
  // ...
});






