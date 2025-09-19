// let functions = [
//   function test1(){
//     console.log('test1');
//     return true;
//   },
//   function test2(){
//     console.log('test2');
//     return true;
//   },
//   function test3(){
//     console.log('test3');
//     return true;
//   },
//   function test4(){
//     console.log('test4');
//     return false;
//   },
//   function test5(){
//     console.log('test5');
//     return true;
//   }
// ];

// test1 - test5 依次执行
// for(let item of functions){
//   item();
// }

// 迭代中间需要截断
// 1.建立在循环的基础上，如果某个函数return false，在for循环执行函数的时候，发现是false就跳出循环即可

// for(let item of functions){
//   if(!item()) {
//     break;
//   }
// }

// 2.建立在迭代的基础上，每个函数都有一个 next 方法，当 next 方法执行，才会执行下一个方法，即中间件截断
// Node中的中间件集合：[test1, test2, test3, test4, test5] 它们依次的功能是设置token -> 检查token -> empore -> 打开页面
// 如果其中的一项函数没有执行通过，则后面的函数都不会执行

// 使用迭代器的方式执行test1-test5，如果函数没有执行next方法，则后面的函数不执行
; ((functions) => {

  function* generator(arr) {
    for (let i = 0; i < arr.length; i++) {
      yield arr[i];
    }
  }

  const iterator = generator(functions);

  const init = () => {
    nextDo(iterator.next()); // 返回test1迭代器对象 {value: test1, done: false}
  }

  function nextDo(n) {
    // 上一个函数执行，参数next函数中会触发下一个函数执行
    n.value(function () {
      // 下一个函数的的迭代器对象
      const n = iterator.next();

      if (!n.done) {
        nextDo(n);
      } else {
        return;
      }
    });
  }

  init();
})([
  function test1(next) {
    console.log('test1');
    next();
  },
  function test2(next) {
    console.log('test2');
    next();
  },
  function test3(next) {
    console.log('test3');
    next();
  },
  function test4(next) {
    console.log('test4');
    // next();
  },
  function test5(next) {
    console.log('test5');
    next();
  }
]);