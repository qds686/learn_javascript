/**
 * Number([value]) 把其他数据类型转换为number数据类型
 * "规则"
 * 	 + 字符串转换为数字：空字符串变为0，如果出现任何非有效数字字符，结果都是NaN
 * 	 + 把布尔转换为数字：true->1  false->0
 * 	 + null->0  undefined->NaN 
 * 	 + Symbol无法转换为数字，会报错：Uncaught TypeError: Cannot convert a Symbol value to a number
 *   + BigInt去除“n”（超过安全数字的，会按照科学计数法处理）
 * 
 *   + 引用数据类型转换为数字的调用步骤
 *     + 先调用对象的 Symbol.toPrimitive 这个属性
 *     + 如果没有这个属性，再调用对象的 valueOf 获取原始值
 *     + 如果没有原始值，再调用对象的 toString 把其变为字符串
 *       + [10,20].toString() -> '10,20'
 *       + ({}).toString() -> '[object Object]'
 *     + 最后再把字符串基于Number方法转换为数字
*/

console.log(Number(''));//0
console.log(Number('12.5px'));//NaN
console.log(isNaN('12px'));// true
console.log(Number(12.5.5));//NaN
console.log(Number('12.5'));//12.5

console.log(Number(true));//1
console.log(Number(false));//0
console.log(isNaN(false));//false

// {}/{xxx:'xxx'}.toString() =>'[object Object]'=>NaN 
// Number(NaN) => NaN
console.log(Number({ name: '10' }));//NaN
console.log(Number({}));//NaN
// [].toString() ->''
console.log(Number([]));//0
//[12].toString() -> '12'
console.log(Number(12));//12
//[12,13].toString() -> '12,13'
console.log(Number([12, 13]));//NaN 
[55].valueOf => [55] //不是原始值，原始值是基本数据类型

console.log(Number(Symbol(10))); // 报错
console.log(Number(BigInt(10))); // 10