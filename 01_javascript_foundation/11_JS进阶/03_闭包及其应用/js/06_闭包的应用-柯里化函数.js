// curring：柯里化函数
// 实现连续求和
const curring = function curring() {
  // EC(Curring)会产生闭包，add执行返回add，每执行一次就合并一次参数
  let params = [];
  const add = (...args) => {
    // 把每次执行add函数传递的实参值，都存储到闭包的params中
    params = params.concat(args);
    return add;
  };
  // 在把对象转换为数字的时候，我们对params进行求和即可
  //   + 在旧版本浏览器中，当我们基于console.log输出函数的时候，会自动调用函数的 toString 方法
  //   + 新版本浏览器中 基于console.log 输出函数不会进行数据类型转换，需要基于“+函数” 操作，把函数(函数也是对象)转换为数字「把对象转换为数字经历：Symbol.toPrimitive->valueOf->toString...」
  add[Symbol.toPrimitive] = () => {
    return params.reduce((res, item) => res + item);
  };
  return add;
};
let add = curring();
let res = add(1)(2)(3);
console.log(+res); // 6 

add = curring();
res = add(1, 2, 3)(4);
console.log(+res); // 10

add = curring();
res = add(1)(2)(3)(4)(5);
console.log(+res); // 15
