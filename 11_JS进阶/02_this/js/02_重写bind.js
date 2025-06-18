var p = {
  age: 18
}

function Person(name, sex) {
  console.log(this);
  console.log(this.age);
  console.log(name, sex);
}

// var p = Person.bind(p, '盒子', '男')(); // {age: 18} 18 '盒子' '男'
// var p = Person.bind(p, '盒子')('男'); // {age: 18} 18 '盒子' '男'

// 这里new 匿名函数之后bind的this会失效，变为Object
// 只需要在匿名函数执行的时候判断是否被new
// var p = Person.bind(p, '盒子'); // 普通函数Person this -> p
// var newP = new p('男'); // Person {} undefined '盒子' '男'

// Function.prototype.myBind = function myBind(context, ...params) {

//   context == null ? context = window : null;
//   !/^(object|function)$/.test(typeof context) ? context = Object(context) : null;

//   var _self = this;

//   return function (...args) {
//     console.log(this, _self); // {} Person(name, sex) {}
//     params = params.concat(args);
//     _self.call(this instanceof _self ? this : context, ...params);
//   }

// }

Function.prototype.myBind = function myBind(context, ...params) {

  context == null ? context = window : null;
  !/^(object|function)$/.test(typeof context) ? context = Object(context) : null;

  var _self = this,
    tempFn = function () { };

  fn = function (...args) {
    console.log(this);
    params = params.concat(args);
    _self.call(this instanceof _self ? this : context, ...params);
  }

  // 圣杯模式
  tempFn.prototype = this.prototype;
  fn.prototype = new tempFn();

  return fn;
}

// var p = Person.myBind(p, '盒子');
// var newP = new p('男'); // Fn {} undefined '盒子' '男'

// var p = Person.myBind(p, '盒子');
// var p1 = p('男'); // {age: 18} 18 '盒子' '男' 

var p = Person.myBind(p, '盒子', '男')(); // {age: 18} 18 '盒子' '男' 