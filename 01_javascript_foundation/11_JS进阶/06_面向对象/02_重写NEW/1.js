function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function () {
  console.log('wangwang');
}
Dog.prototype.sayName = function () {
  console.log('my name is ' + this.name);
}

// 内置new 
/*
let sanmao = new Dog('三毛');
sanmao.sayName();
sanmao.bark();
*/

/* 
// 1.基本功能实现
function _new(ctor, ...args) {
  // ctor：需要创建哪个类的实例
  // ctor: Dog args:['三毛']
  // 1.创建一个空实例对象 对象.__proto__===ctor.prototype
  let obj = {};
  obj.__proto__ = ctor.prototype;

  // 2.像普通函数一样执行，但是需要让函数中的this指向创建的实例对象 (实参值也要传递进去)
  let result = ctor.call(obj, ...args);

  // 3.监听方法执行的返回值，如果返回的是原始值类型，则把创建的实例返回，如果返回的是对象则以自己返回的为主
  if (result !== null && /^(object|function)$/.test(typeof result)) return result;
  return obj;
}
*/

// 2.优化：只考虑细节不考虑兼容
/*
IE浏览器中对 __proto__ 进行了保护，不能直接修改 __proto__
  + 使用Object.create(obj)：
    + 创建一个空对象，并且把obj作为它的原型对象「空对象.__proto__===obj」
    + 参数必须是对象或者null
  + Object.create(null)：创建一个不具备任何原型指向的空对象「对象.__proto__=undefined」 
*/
function _new(ctor, ...args) {
  let obj, result;
  // 箭头函数没有原型，Symbol和BigInt不能被new，则报错
  if (!ctor.prototype || ctor === Symbol || ctor === BigInt) {
    throw new TypeError('ctor is not a constructor');
  };
  obj = Object.create(ctor.prototype);
  result = ctor.call(obj, ...args);
  if (result !== null && /^(object|function)$/.test(typeof result)) return result;
  return obj;
}

let sanmao = _new(Dog, '三毛');

sanmao.bark(); // "wangwang"
sanmao.sayName(); // "my name is 三毛"
console.log(sanmao instanceof Dog); // true
