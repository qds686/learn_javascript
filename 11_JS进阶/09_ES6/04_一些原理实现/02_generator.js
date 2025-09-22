function* gen() {
  yield '盒子';
  yield 18;
  return '玩游戏';
}

// 原理实现
function generator(arr) {
  let nextIdx = 0;

  return {
    next: function () {
      return nextIdx < arr.length
        ? { value: arr[nextIdx++], done: false }
        : { value: undefined, done: true };
    }
  }
}

let itor = generator(["盒子", 18, "玩游戏"]);
// console.log(itor.next()); // { value: '盒子', done: false }
// console.log(itor.next()); // { value: 18, done: false }
// console.log(itor.next()); // { value: '玩游戏', done: false }
// console.log(itor.next()); // { value: undefined, done: true }

// babel编译过程：Switch + while
function generator$(ctx) {
  while (true) {
    switch (ctx.current = ctx.next) {
      case 0:
        ctx.next = 1;
        return '盒子';
      case 1:
        ctx.next = 2;
        return 18;
      case 2:
        ctx.finish();
        ctx.next = 3;
        return '玩游戏';
      default:
        return undefined;
    }
  }
}

function generator1() {
  var ctx = {
    current: 0,
    next: 0,
    done: false,
    finish() {
      this.done = true;
    }
  };

  return {
    next() {
      return {
        value: generator$(ctx),
        done: ctx.done
      }
    }
  }
}

var itor1 = generator1();
console.log(itor1.next()); // { value: '盒子', done: false }
console.log(itor1.next()); // { value: 18, done: false }
console.log(itor1.next()); // { value: '玩游戏', done: false }
console.log(itor1.next()); // { value: undefined, done: true }
console.log(itor1.next()); // { value: undefined, done: true }