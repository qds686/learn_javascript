/**
 * 知识点1：“+”在JS中除了数学运算还有字符串拼接
 * @1 字符串拼接的情况：前提 n+m左右变量都有值
 *   1.n/m是字符串
 *   2.n/m是一个对象
 *     + {} + 10 -> 把{}当做代码块不参与运算 -> 10
 *     + 10 + {} -> {}参与运算 -> 10 + "[object Object]"
 *     + 10 + new Number(10) -> 10 + 10 拆箱
 * @2 对象转换为数字/字符串
 *   1.首先调用它的 Symbol.toPrimitive 属性获取原始值（基本数据类型值）
 *   2. 没有这个属性，则继续调用 valueOf 方法获取原始值
 *   3.如果还是没有获取到原始值，则基于 toString 方法把其转换为字符串，最后基于 Number 方法转换为数字
 */


// let a = 10 + null + true + [] + undefined + '盒子' + null + [] + 10 + false;
// console.log(a); // '11undefined盒子null10false'
/*
10+null = 10 +0 = 10
10 + true = 10+1=11
11+[] =11+''='11' 空数组变为数字，先要经历变为空字符串，遇到字符串，啥都别想了，直接变为字符串拼接
'11'+ undefined -> '11undefined'
...
'11undefined盒子null10false'
*/

// let b = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
// console.log(b); // 'NaNTencentnull9false'


// 条件?成立做的事情:不成立做的事情
// 知识点2：把其他数据类型转换为布尔类型，只有"null/undefined/''/0/NaN"
// { } + 0 ? alert('ok') : alert('no');
// {}+0 -> 0 => 'no'
// 0 + {} ? alert('ok') : alert('no');
// 0 + {} -> '0[object Object]' => 'ok'


/**
 * 知识点3：把其他数据类型转换为数字（显示、隐式）
 *   + Number([value])
 *     + 字符串：空字符串是零;只要字符串中出现任意一个非有效数字字符，结果都是NaN
 *     + 布尔：true->1 false->0
 *     + null->0
 *     + undefined->NaN
 *     + Symbol不能转换为数字
 *     + BigInt争创转换
 *     + 对象转换为数字：遵循之前整理的三步规则
 * 
 *   + parseInt/parseFloat([value])
 *     + 首先要把value转换为字符串
 *     + 从字符串左侧第一个字符开始查找，把找到的有效数字政府最后转换为数字，知道遇到一个非有效数字的时候，则结束查找
 *     + 如果一个有效数字字符都没有找到，结果就是NaN
 * 
 * NaN!==NaN NaN和任何值都不相等
 *   + typeof NaN === 'number'
 *   + isNaN
 *   + Object.is(NaN,NaN)->true  内部做了特殊处理
 * 
 * ===:三个等号值和类型都要一致，==: 相等
 *   + 区别就是两边数据类型不一样的时候，"=="会默认隐式转换为相同的数据类型，然后再进行比较，而"==="直接返回false，不会进行隐式转换
 *   + n==m:n/m类型不一样
 *     + null == undefined -> true，但是null/undefined和其他任何值都不相等
 *     + null===undefined -> false
 *     + 对象==字符串 把对象转换为字符串
 *     + 剩余的情况，一般都基于 Number 隐式转换为数字
 */
// let res = Number('12px'); // NaN
// if (res === 12) {
//   alert(200);
// } else if (res === NaN) { // NaN !== NaN
//   alert(NaN);
// } else if (typeof res === 'number') { // NaN是一个数字
//   alert('number');
// } else {
//   alert('Invalid Number');
// }
// log: number

parseInt("") //NaN
Number("") //0
isNaN("") //false 0是有效数字

parseInt(null) // parseInt("null") //NaN
Number(null) //0
isNaN(null) //false

parseInt("12px") //12
Number("12px"); //NaN
isNaN("12px"); //true

parseFloat("1.6px") + parseInt("1.2px") + typeof parseInt(null)
// 1.6 + 1 + "number"
// 2.6 + "number" => "2.6number" 在JS中加号左右两边出现字符串，则变为字符串拼接(有特殊性)，如果出现对象也会变为字符串拼接(因为原本，应该是把对象转换为数字，但是对象转数字需要先转换为字符串，则+遇到字符串直接变为字符串拼接 1+[])

isNaN(Number(!!Number(parseInt("0.8")))) // false
// parseInt("0.8") => 0
// !!0 => false
// Number(false) => 0
// isNaN(0) => false

!(!"Number(undefined)") // true
// "Number(undefined)" 只是个字符串 
// !"..." -> false
// !false -> true

isNaN(parseInt(new Date())) + Number([1]) + typeof undefined; 
// isNaN(parseInt(new Date()))
//  + isNaN(NaN) -> true
// Number([1])
//  + [1].toString() -> '1'
//  + Number('1') -> 1
// typeof undefined -> 'undefined'
// -> true + 1 + 'undefined' -> '2undefined'

!!Number("") + !isNaN(Number(null)) + !!"parseInt([])" + typeof !null; 
/*
  !!Number("")
    + !!0 -> false
  !isNaN(Number(null))
    + !isNaN(0) -> !false -> true
  !!"parseInt([])"
    + !!"..." -> true
  typeof !null 
    + typeof true -> 'boolean'
  -> false + true + true + 'boolean' -> '2boolean'
*/

!typeof parseFloat("0"); 
// !typeof 0 -> !'number' -> false

typeof "parseInt(null)" + 12 + !!Number(NaN); 
/* 
  typeof "parseInt(null)" -> 'string'
  12
  !!Number(NaN) -> false
  -> 'string12false'
*/

!typeof (isNaN("")) + parseInt(NaN); 
/* 
  !typeof (isNaN(""))
    + ！typeof false -> !'boolean' -> false
  parseInt(NaN) -> NaN
  -> false + NaN -> NaN
*/

typeof !parseInt(null) + !isNaN(null)
// parsetInt(null) => NaN
// !NaN => true
// typeof true => "boolean"
// isNaN(null) => false
// !false => true
// => "booleantrue"

// 知识点4：typeof检测数据类型，返回的结果是一个字符串，字符串中包含了对应的数据类型
// var a = typeof typeof typeof null;
/* 
typeof null -> "object"
typeof "object" -> "string"
typeof "string" -> "string"
*/
// console.log(a); // 'string'




