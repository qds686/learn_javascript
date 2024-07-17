/**
 * 布尔数据类型
 *   + true / false
 * 
 * 把其他数据类型值转换为布尔类型 
 *   + Boolean([value]) / !![value]
 *     + 转换规则：只有 0 NaN 空字符串 null undefined 变为布尔的false，其余都是true 
 *     + ![value]: 把value转换为布尔类型，然后取反
 *   + 条件判断
 */

if (10) {
  // 首先会把10转换为布尔类型，然后验证真假，决定条件是否成立
}

/**
 * Symbol创建一个唯一值：
 *   + Symbol() 或者 Symbol('描述')
 *   + 不能被NEW执行，如果想创建其“非标准特殊对象”，则基于 Object(Symbol())
 *   + Object(value)：把value值变为对象类型
 */
// Symbol的作用：
// 1.创建一个独一无二的值
console.log(Symbol('AA') === Symbol('AA')); //false 只要Symbol一执行，就会创建一个唯一值！！

/**
 * 2.对象可以设置一个Symbol类型的属性（也是为了保证其唯一性）
 *   + 设置的属性是特殊值「含 变量、数组、对象、Symbol...」，则需要用中括号包起来，让语法符合规范
 *   + 对象属性名的类型：字符串 和 Symbol
 *   + 可枚举和不可枚举
 *     + 内置属性不可枚举，自定义属性可枚举，规则可以修改
 *     + 粗略的认为，可以被for/in循环迭代(遍历/循环)到的，就是可枚举的
 * 
 * for in特点:
 *   + 它会去当前对象所有的属性上「含：私有属性和原型链上的公有属性」进行查找
 *   + 只会迭代可枚举的属性「不论属性是公有还是私有」
 *   + 迭代不了Symbol类型的属性
 */

let obj1 = {
  name: "hezi",
  age: 18,
  [Symbol('AA')]: 'aaa'
}
console.log(obj1);

/**
 * 3.获取所有的私有属性
 *   + Object.keys(obj)：获取当前对象 私有的、可枚举的、非Symbol类型的 属性「以数组存储」
 *   + Object.getOwnPropertyNames(obj)：获取当前对象 私有的、非Symbol类型的 属性
 *   + Object.getOwnPropertySymbols(obj)：获取当前对象 私有的、Symbol类型的 属性
 */

let sym = Symbol('AA');
let obj = {
  0: 100,
  name: '盒子',
  true: 0,
  [[10, 20]]: 1000,
  [{ x: 10, y: 20 }]: 2000,
  null: -1,
  undefined: -2,
  [sym]: '哈哈哈'
};
// console.log(obj); // 对象的键都会转换为字符串或者Symbol

console.log(Object.keys(obj)); // ['0', 'name', 'true', '10,20', '[object Object]', 'null', 'undefined']

console.log(Object.getOwnPropertyNames(obj)); // ['0', 'name', 'true', '10,20', '[object Object]', 'null', 'undefined']

console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(AA)]

// 获取所有的私有属性，是一个(string | symbol)[]类型的数组集合
let keys = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
console.log(keys); // ['0', 'name', 'true', '10,20', '[object Object]', 'null', 'undefined', Symbol(AA)]

// 获取所有私有属性「ES6」
let keys1 = Reflect.ownKeys(obj);


/**
 * BigInt 大数字
 *   + 浏览器具备最大/最小安全数字「Number.MAX_SAFE_INTEGER/MIN_SAFE_INTEGER」，超过安全数字进行运算，结果是不一定准确的！！
 * 
 * 如何解决：
 * 服务器端存储的数字也是有长度的限制的「和客户端规则不尽相同」，如果服务器返回一个超大数字(一般都是返回字符串，客户端想要进行计算)；按照之前的规则是不准确的，此时需要基于BigInt处理！！
 *   + 把服务器返回的字符串，变为BigInt格式{在数字末尾加n}
 *   + 让BigInt值和另外一个BigInt值进行运算{BigInt值不能和普通数字运算}
 *   + 把运算的结果返回给后端「也是变为字符串传递进去 String(value)」
*/

/**
 * undefined表示缺少值，即此处应该有值，但没有定义
 * null表示没有，即该处不应该有值
 */

/*
  null和undefined的区别
    1. undefined通常只有在一个变量声明但是未初始化时候，它的默认值是undefined才会用到
    2. 并且不推荐直接给一个变量赋值为undefined，所以很少主动使用
    3. null值非常常用，当一个变量准备保存一个对象，但是这个对象不确定时，可以先赋值为null
*/