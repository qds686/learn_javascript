/* 
Generator 生成器函数：function* 函数名()
  fn(10,20)
    + 函数体中的代码并没有执行「实参值已经预先传递进去了」
    + 返回一个具备迭代器规范的对象itor：next/return/throw
  itor -> fn.prototype -> GeneratorFunction.prototype(next/return/throw) -> 迭代器对象(drop/every/filter/find/flatMap/forEach/map/reduce/some/take/toArray/Symbol.iterator) -> Object.prototype

  执行itor.next()才会执行函数体中的代码
    + 把之前预先传递的实参赋值给形参变量
    + this->window
    + 遇到 yeild 或者 return 结束
    + 返回的结果是一个对象 {value: yeild或者return的值, done: false/true}
*/

// function fn() {
//   console.log(this);
//   return 10;
// }
// let itor = fn();
// console.log(itor); // 10

// function* fn(x, y) {
//   console.log(x, y);
//   console.log(this);
//   return 10;
// }
// fn.prototype.x = 100;
// let itor = fn(10, 20);
// console.log(itor); // 10

// function* fn(x, y) {
//   console.log(x, y); // 10 20
//   console.log(this); // window
//   return 10;
// }
// fn.prototype.x = 100;
// let itor = fn(10, 20);
// console.log(itor.next()); // {value: 10, done: true}

// ---------------------
/* 
function* generator() {
  console.log('A');
  yield 10;
  console.log('B');
  yield 20;
  console.log('C');
  yield 30;
  console.log('D');
  return 100;
}
let iterator = generator();
console.log(iterator.next()); //-> A {done:false,value:10}
console.log(iterator.next()); //-> B {done:false,value:20}
console.log(iterator.next()); //-> C {done:false,value:30}

// console.log(iterator.next()); //-> D {done:true,value:undefined} 最后没有return
console.log(iterator.next()); //->{done:true,value:4} 最后有return
*/

/* throw */
// function* generator() {
//   yield 10;
//   yield 20;
//   yield 30;
// }
// let itor = generator();
// console.log(itor.next()); // {value: 10, done: false}

// console.log(itor.throw('异常原因')); // 手动抛出异常，结束函数中的代码执行，下面的代码都不再执行
// console.log(itor.next()); // 此处的代码不再执行

// console.log(itor.return(100));// {value: 100, done: true} 遇到return则结束函数执行，done设置为true
// console.log(itor.next()); // {value: undefined, done: true} 后面再执行返回undefiend

// ----------
/* 给next传参 */
/* 
function* generator() {
  let res = yield 10;
  console.log(res);

  res = yield 20;
  console.log(res);

  res = yield 30;
  console.log(res);
}
let itor = generator();
console.log(itor.next(100)); //     {value: 10, done: false} 第一次执行next传递的值没有用，因为前面没有yeild
console.log(itor.next(200)); // 200 {value: 20, done: false} 把200赋值给第一个res，每一次next传递的值，会作为上一次yeild执行的返回值
console.log(itor.next(300)); // 300 {value: 30, done: false} 把300赋值给第二个res
console.log(itor.next(400)); // 400 {value: undefined, done: true} 把400赋值给第三个res
*/

/* yield*:可以保证代码执行到这的时候，进入到新的generator函数中去执行 */
/* 
function* generator1() {
  yield 10;
  yield 20;
}
function* generator2() {
  yield 30;
  yield* generator1();
  yield 40;
}
let itor = generator2();

// 不加yield*
console.log(itor.next()); // {value:30, done: false}
console.log(itor.next()); // {value:生成器函数, done: false}
console.log(itor.next()); // {value:40, done: false}
console.log(itor.next()); // {value:undefined, done: true}

// 加yield*
console.log(itor.next()); // {value:30, done: false}
console.log(itor.next()); // {value:10, done: false}
console.log(itor.next()); // {value:20, done: false}
console.log(itor.next()); // {value:40, done: false}
console.log(itor.next()); // {value:undefined, done: true}
*/

/* 模拟发送请求 */
const query = interval => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(interval);
    }, interval);
  });
};

// 需求：串行发送三个请求，请求时间分别是 1000/2000/3000ms

// then链机制
/* 
query(1000).then(value => {
  console.log('第一个成功', value);
  return query(2000);
}).then(value => {
  console.log('第二个成功', value);
  return query(3000);
}).then(value => {
  console.log('第三个成功', value);
}).catch(reason => {
  console.log('请求发送失败！');
});
*/

// Generator手动一步步操作
/*
function* generator() {
  let value = yield query(1000);
  console.log('第一个成功', value);

  value = yield query(2000);
  console.log('第二个成功', value);

  value = yield query(3000);
  console.log('第三个成功', value);
}

// let itor = generator();
// console.log(itor.next()); // value:第一次请求的promise实例，接下来我们需要等待本次请求成功，获取到结果后，再去执行下一次的next方法
// console.log(itor.next()); // 第一个成功 undefined {value:第二个Promise实例, done:false}
// console.log(itor.next()); // 第二个成功 undefined {value:第三个Promise实例, done:false}
// console.log(itor.next()); // 第三个成功 undefined {value:undefined, done:true}

let itor = generator();
itor.next().value.then(val => {
  // val:第一次请求成功的结果
  itor.next(val).value.then(val => {
    // val:第二次请求成功的结果
    itor.next(val).value.then(val => {
      // val:第三次请求成功的结果
      itor.next(val);
    });
  });
});
*/

// 不知道需要几步，封装generator实现async await这种模式
// 开发中不用这样写，有co.js插件
/**
 * async await 原理
 * @param {*} generator :生成器函数
 * @param  {...any} params ：初始执行generator传递的实参信息
 * @returns 执行返回一个Promise实例
 */
function AsyncFunc(generator, ...params) {
  return new Promise((resolve, reject) => {
    const iterator = generator(...params);
    const next = x => {
      let {
        value,
        done
      } = iterator.next(x);
      if (done) {
        resolve();
        return;
      }
      value.then(x => {
        next(x);
      }).catch(reason => {
        reject(reason);
        itor.throw(reason);
      });
    };
    next();
  });
}

AsyncFunc(
  function* generator() {
    let value = yield query(1000);
    console.log('第一个成功', value);

    value = yield query(2000);
    console.log('第二个成功', value);

    value = yield query(3000);
    console.log('第三个成功', value);
  }
).then(value => {
  console.log('请求都成功', value);
}).catch(reason => {
  console.log('请求失败', reason);
});

// async await 是 generator+promise 的“语法糖”
(async () => {
  let result = await query(1000);
  console.log(`第一个请求成功，结果是：${result}`);

  let result = await query(2000);
  console.log(`第二个请求成功，结果是：${result}`);

  let result = await query(3000);
  console.log(`第三个请求成功，结果是：${result}`);
})();