const add1 = x => x + 1;
const mul3 = x => x * 3;
const div2 = x => x / 2;

/* 
// 常规操作
const compose = (...funcs) => {
  // EC(Compose)闭包：func=[div2, mul3, add1, add1]
  let len = funcs.length;
  // funcs中一项都没有，operate传的啥就输出啥
  if (len === 0) return x => x;
  // if (len === 1) return x => funcs[0](x);
  // 如果只有一项，则返回这个函数，最后执行的时候传递x即可
  if (len === 1) return funcs[0];

  const operate = x => {
    // 第一个函数执行的初始实参值 x=0
    return funcs.reduceRight((res, func) => {
      return func(res);
    }, x);
  }
  return operate;
};

const operate = compose(div2, mul3, add1, add1);
console.log(operate(0)); // 3
console.log(operate(2)); // 6
*/

// redux源码中的：用redux构建模型，执行的时候反推回来
const compose = function compose(...funcs) {
  if (funcs.length === 0) return x => x;
  if (funcs.length === 1) return funcs[0];
  /**
   * 第一轮遍历 a=div2 b=mul3
   *      x=>a(b(x)) 0x000
   * 第二轮遍历 a=0x000 b=add1
   *      x=>a(b(x)) 0x001
   * 第三轮遍历 a=0x001 b=add1
   *      x=>a(b(x)) 0x002
   * -->最后返回的是 0x002,把其赋值给operate
   * 0x002(0)  -> 0x001(add1(0))
   * 0x001(1)  -> 0x000(add1(1))
   * 0x000(2)  -> div2(mul3(2)) =>3
   */
  return funcs.reduce((a, b) => {
    return x => {
      return a(b(x));
    }
  });
};
const operate = compose(div2, mul3, add1, add1);
console.log(operate(0)); // 3
console.log(operate(2)); // 6
console.log(compose()(10)); // 10
console.log(compose(div2)(10)); // 5