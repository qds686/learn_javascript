// Object.prototype.hasOwnProperty：用来检测是否为私有属性
//  + 语法：[对象].hasOwnProperty([属性])
//  + 检测属性是否为对象的私有属性，是则返回true，不是则返回false，只看私有中有没有，和公有中是否存在没有关系
// 私有属性还是共有属性本身就是相对的概念

let arr = [10, 20];
console.log(arr.hasOwnProperty('push')); // false
console.log(Array.prototype.hasOwnProperty('push')); // true

// in操作符
//  + 语法；属性 in 对象
//  + 检测属性是不是这个对象的属性，不论公有还是私有，只要能访问到这个属性，则结果就是true

console.log('push' in arr); // true

// 面试题：在Object.prototype.hasPubProperty，用户来检测当前属性是否为对象的共有属性，不关心私有中是否存在
Object.prototype.hasPubProperty = function (attr) {
  // this->obj要处理的对象 attr->'toString'要检测的属性

  // 思路1：是对象的属性而且还不是私有的属性，这样就只能是公有属性 
  // 问题：如果attr既是私有的属性，也是公有的属性，基于这种方案检测结果是false
  // return attr in this && !Object.prototype.hasOwnProperty(attr);

  // 思路2：跳过私有属性的查找，直接在共有属性中查找，看看是否存在
  // Object.getPrototypeOf(对象)：获取当前实例对象的原型对象「获取实例对象.__proto__」
  let proto = Object.getPrototypeOf(this);
  // 实例对象没有原型对象
  if(!proto) return false;
  // 在原型对象中查找私有属性
  //  + proto存在
  //    + 找到返回true
  //    + 没有找到则继续找原型对象的原型对象中attr是否存在
  //      + 存在，返回true
  //      + 循环走完了，条件没有符合的，则最后返回false
  while(proto){
    if(proto.hasOwnProperty(attr)) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};
let obj = {
  name: '盒子',
  age: 18,
  toString() { }
};
console.log(obj.hasPubProperty('toString')); // true
