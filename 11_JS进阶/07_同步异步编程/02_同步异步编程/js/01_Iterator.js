/* 
ES6新增的内容汇总：
  let/const/class、、ES6Module模块规范(import export)、Symbol/BigInt、箭头函数、解构赋值...
  数组和对象及正则新增的方法、模版字符串、Set/Map...

iterator迭代器: 只是一种机制(接口)，可以为各种不同的数据结构提供统一的循环和迭代规范，任何数据结构只要部署Iterator接口，就可以完成遍历操作，依次处理该数据结构的所有成员
  
  + 拥有 Iterator 机制的对象，必须具备 next 方法：执行这个方法可以一次访问对象中的每个成员
  + 执行next返回值是一个对象：
    + value：当前迭代的这一项
    + done：记录是否迭代完成
*/

// 浏览器中没有提供这个类，自己实现一个Iterator
/* 
class Iterator {
  constructor(assemble){
    let self = this;
    // 把传进来的集合挂载到实例上，后面next迭代的时候在这里取值
    self.assemble = assemble;
    // 记录索引
    self.index = 0;
  }

  next(){
    let self = this,
        assemble = self.assemble;
    if(self.index > assemble.length -1 ){
      return {
        value: undefined,
        done: true
      }
    }
    return {
      value: assemble[self.index++],
      done: false
    };
  }
}

let itor = new Iterator([10,20,30,40]);
console.log(itor.next());// {value: 10, done: false}
console.log(itor.next());// {value: 20, done: false}
console.log(itor.next());// {value: 30, done: false}
console.log(itor.next());// {value: 40, done: false}
console.log(itor.next());// {value: undefined, done: true}
*/

/* 
虽然不具备 Iterator 内置类，但是对于某些数据结构，它提供了 Symbol.iterator 属性方法，这个方法具备迭代规范，基于这个方法可以一次迭代数据中的每一项
  + 符合原型上有这个属性的有：数组、Set、Map、String、部分类数组(arguments在私有属性上/NodeList/HTMLCollection...)、generator object...
  + 对象默认不具备Symbol.iterator,属于不可被遍历的数据结构
  + 符合条件的都可以用for of进行迭代处理
  --------
  把Symbol.iterator方法执行，会返回一个具备迭代器规范的itor对象，基于itor.next()依次执行，就可以获取到数据集合中的每一项
  ES6中新提供的“for...of”循环，就是按照这套机制去迭代的
*/

let arr = [10, 20, 30];

// 方式一：用私有属性依次迭代数组中的每一项
// let itor = arr[Symbol.iterator]();
// console.log(itor.next()); // {value:10,done:false}
// console.log(itor.next()); // {value:20,done:false}
// console.log(itor.next()); // {value:30,done:false}
// console.log(itor.next()); // {value:undefined,done:true}

// 方式二：用for of循环
/* 
1.先去找 arr[Symbol.iterator] 执行 (如果数据集合不具备这个属性的会报错 Uncaught TypeError: xx is not iterable)，返回一个迭代器对象 itor
2.每一轮循环都会执行一次 itor.next()方法，把结果中的value赋值给循环中的value；当done为true时，则结束这次循环！！
*/

/* 
// let arr = [10, 20, 30];
// for (let value of arr) {
//   console.log(value); // 10 20 30 
// }

// 重构Symbol.iterator来实现对for of的控制
let arr = [10, 20, 30];
arr[Symbol.iterator] = function () {
  // 必须返回一个符合Iterator规范的对象：具备next方法
  let index = 0,
    self = this;
  return {
    next() {
      if (index > self.length - 1) {
        return {
          done: true,
          value: undefined
        };
      }
      return {
        value: self[index++],
        done: false
      };
    }
  };
};
for (let value of arr) {
  console.log(value); // 10 20 30 
}

*/

// 对象本身不是符合Iterator遍历规范的数据结构:我们可以手动设置Symbol.iterator让其具备这个能力
// let obj = {
//   name: '盒子',
//   age: 18
// };
// for (let value of obj) {
//   console.log(value); // Uncaught TypeError: obj is not iterable
// }

// 让对象也符合for of循环的规范
/* 
let obj = {
  name: '盒子',
  age: 18
};
Object.prototype[Symbol.iterator] = function () {
  let self = this,
    keys = [
      ...Object.getOwnPropertyNames(self),
      ...Object.getOwnPropertySymbols(self)
    ],
    index = 0;
  return {
    next() {
      return index > keys.length - 1 ? {
        done: true,
        value: undefined
      } : {
        done: false,
        value: self[keys[index++]]
      };
    }
  };
};

for (let value of obj) {
  console.log(value); // '盒子' 18
}
*/

// 类数组实现for of迭代
let obj = {
  0: 10,
  1: 20,
  2: 30,
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
    /* 
    [Symbol.iterator]: function() {
      let index = 0,
        self = this;
      return {
        next() {
          return index > self.lenght - 1 ? {
            done: true,
            value: undefined
          } : {
            done: false,
            value: self[index++]
          }
        }
      }
    }
    */
};
for (let item of obj) {
  console.log(item);//10 20 30
}


/* 
循环的性能从高到低依次是：
for循环(i是私有的) -> for循环(i是全局的) && while循环 -> forEach循环(内部封装的方法，做了逻辑判断处理，所以要稍微比命令式编程慢一些) -> for/of循环(迭代器一次次的执行) -> for/in循环(它会依次查找私有和原型链上所有可枚举的属性，所以比其他循环慢很多，项目中不建议使用for/in)
*/