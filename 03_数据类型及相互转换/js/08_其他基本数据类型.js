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
 *     + Object(value)：把value值变为对象类型
 */
// console.dir(Symbol);
// Symbol的作用：
// 1.创建一个独一无二的值
// console.log(Symbol('AA') === Symbol('AA')); //false 只要Symbol一执行，就会创建一个唯一值！！

/**
 * 2.对象可以设置一个Symbol类型的属性（也是为了保证其唯一性）
 *   + 设置的属性是特殊值「含 变量、数组、对象、Symbol...」，则需要用中括号包起来，让语法符合规范
 *   + 对象属性名的类型：
 *     + 字符串
 *     + Symbol
 *     + Map新的数据结构：可以允许属性名是对象
 *   + 可枚举和不可枚举
 *     + 内置属性不可枚举，自定义属性可枚举，规则可以修改
 *     + 粗略的认为，可以被for/in循环迭代(遍历/循环)到的，就是可枚举的
 * 
 * for in特点:
 *   + 它会去当前对象所有的属性上「含：私有属性和原型链上的公有属性」进行查找
 *   + 只会迭代可枚举的属性「不论属性是公有还是私有」
 *   + 迭代不了Symbol类型的属性
 *   + 迭代顺序以数字属性优先
 */
let key = Symbol('BB');
let obj1 = {
  name: "hezi",
  age: 18,
  [Symbol('AA')]: 'aaa',
  [key]: 'bbb'
}
// console.log(obj1); // {name: 'hezi', age: 18, Symbol(AA): 'aaa'}
// console.log(obj1[Symbol('AA')]); // 这样操作是创建一个唯一值，两次的值不同，所以结果是 undefined
// console.log(obj1[key]); // 想要获取到同一个引用值，所以需要在对象外部定义一个变量，即可获取到Symbol的属性值 -> 'bbb'

for (let key in obj1) {
  //解决问题一：遍历不到公有中可枚举的「但是无法改善性能差的问题」
  if (!obj1.hasOwnProperty(key)) break;
  // console.log(key); // name age
}

// symbol属性不能被模板字符串转换为字符串，类型是Symbol类型
obj1.forEach(key => {
  // console.log("属性名：", typeof key);
  // console.log("属性值：", obj[key]);
});
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

// console.log(Object.keys(obj)); // ['0', 'name', 'true', '10,20', '[object Object]', 'null', 'undefined']

// console.log(Object.getOwnPropertyNames(obj)); // ['0', 'name', 'true', '10,20', '[object Object]', 'null', 'undefined']

// console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(AA)]

// 获取所有的私有属性，是一个(string | symbol)[]类型的数组集合
let keys = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
// console.log(keys); // ['0', 'name', 'true', '10,20', '[object Object]', 'null', 'undefined', Symbol(AA)]

// 获取所有私有属性「ES6」
let keys1 = Reflect.ownKeys(obj);

// 4.提供某些JS的底层实现机制
// 4.1 12静态属性
// @1 迭代 symbols Symbol.iterator
//   符号指定了一个对象的默认异步迭代器
//   如果一个对象设置了这个属性，它就是异步可迭代对象，可用于for await...of循环。
const myAsyncIterable = new Object();
myAsyncIterable[Symbol.asyncIterator] = async function* () {
  yield "hello";
  yield "async";
  yield "iteration!";
};

(async () => {
  for await (const x of myAsyncIterable) {
    console.log(x);
    // expected output:
    //    "hello"
    //    "async"
    //    "iteration!"
  }
})();

// @2 Symbol.hasInstance
// 一个确定一个构造器对象识别的对象是否为它的实例的方法。被 instanceof 使用。
class Array1 {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof Array1);
// Expected output: true

// @3 Symbol.isConcatSpreadable
// 一个数组作为concat的参数时，可以设置Symbol.isConcatSpreadable=true/false，表示扁平化或者不扁平化
// 被 Array.prototype.concat() 使用
const alpha = ['a', 'b', 'c'];
const numeric = [1, 2, 3];
let alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// Expected output: Array ["a", "b", "c", 1, 2, 3]

numeric[Symbol.isConcatSpreadable] = false;
alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// Expected output: Array ["a", "b", "c", Array [1, 2, 3]]

// @4 正则表达式 symbols Symbol.match
// 一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 String.prototype.match() 使用。

// @5 Symbol.matchAll 内置通用（well-known）符号指定方法返回一个迭代器，该迭代器根据字符串生成正则表达式的匹配项。此函数可以被 String.prototype.matchAll() 方法调用。

// @6 Symbol.replace
// 一个替换匹配字符串的子串的方法。被 String.prototype.replace() 使用。

// @7 Symbol.search
// 一个返回一个字符串中与正则表达式相匹配的索引的方法。被 String.prototype.search() 使用。

// @8 Symbol.species
// 一个用于创建派生对象的构造器函数。

// @9 Symbol.split
// 一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 String.prototype.split() 使用。

// @10 Symbol.toPrimitive
// 一个将对象转化为基本数据类型的方法。

// @11 Symbol.toStringTag
// 用于对象的默认描述的字符串值。被 Object.prototype.toString() 使用。
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'Validator';
  }
}

console.log(Object.prototype.toString.call(new ValidatorClass()));
// Expected output: "[object Validator]"


// @12 Symbol.unscopables
// 拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。

// 4.2 静态方法
// key keyFor

// 5.用redux或Vuex做公共状态在派发行为标识统一管理的时候，可以基于Symbol类型的值，保证行为标识的唯一性

/**
 * BigInt 大数字
 *   + 浏览器具备最大/最小安全数字「Number.MAX_SAFE_INTEGER/MIN_SAFE_INTEGER」，超过安全数字进行运算，结果是不一定准确的！！
 * 
 * 如何解决：
 * 服务器端存储的数字也是有长度的限制的「和客户端规则不尽相同」，如果服务器返回一个超大数字(一般都是返回字符串，客户端想要进行计算)；按照之前的规则是不准确的，此时需要基于BigInt处理！！
 *   + 服务器返回给客户端的大数，按照“字符串”格式返回
 *   + 客户端把其变为BigInt，然后按照BigInt进行运算
 *   + 最后把运算后的BigInt转换为字符串xxxn.toString()，再传递给服务器
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