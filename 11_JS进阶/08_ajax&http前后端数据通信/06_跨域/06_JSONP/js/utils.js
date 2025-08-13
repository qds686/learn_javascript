const class2type = {};
const hasOwn = class2type.hasOwnProperty;

// 检测是不是纯粹对象或者是标准普通对象
const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor;
  // 对象不存在null/undefined 或者 检测不是对象，返回false
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  // 获取当前对象的原型对象
  proto = Object.getPrototypeOf(obj);

  // 匹配 Object.create(null)
  if (!proto) {
    return true;
  }

  // 在原型对象的私有属性上是否有constructor属性
  // 如果有，则获取constructor，没有就是false
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  // 构造函数constructor是一个函数，并且是Object，即找的就是Object的原型
  return typeof Ctor === "function" && Ctor === Object;
}

// 把对象变为urlencoded格式字符串 xxx=xxx&xxx=xxx
const stringify = function stringify(obj) {
  // 获取所有的私有属性，返回数组
  let keys = Reflect.ownKeys(obj),
    str = ``;
  keys.forEach(key => {
    str += `&${key}=${obj[key]}`
  });
  return str.substring(1);
};