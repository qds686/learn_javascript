// 面试题1
let a = 10+null+true+[]+undefined+'盒子'+null+[]+10+false;
console.log(a);
/*
10+null = 10 +0 = 10
10 + true = 10+1=11
11+[] =11+''='11' 空数组变为数字，先要经历变为空字符串，遇到字符串，啥都别想了，直接变为字符串拼接
'11'+ undefined -> '11undefined'
...
'11undefined盒子null10false'
*/

// 面试题2
parseInt("") //NaN
Number("") //0
isNaN("") //false 0是有效数字
parseInt(null) // parseInt("null") //NaN
Number(null) //0
isNaN(null) //false
parseInt("12px") //12
Number("12px"); //NaN
isNaN("12px"); //true
parsetFlot("1.6px") + parseInt("1.2px") + typeof parseInt(null)
// 1.6 + 1 + "number"
// 2.6 + "number" => "2.6number" 在JS中加号左右路两边出现字符串，则变为字符串拼接(有特殊性)，如果出现对象也会变为字符串拼接(因为原本，应该是把对象转换为数字，但是对象转数字需要先转换为字符串，则+遇到字符串直接变为字符串拼接 1+[])
isNaN(Number(!!Number(parseInt("0.8")))) // false
// parseInt("0.8") => 0
// !!0 => false
// Number(false) => 0
// isNaN(0) => false
typeof !parseInt(null) + !isNaN(null)
// parsetInt(null) => NaN
// !NaN => true
// typeof true => "boolean"
// isNaN(null) => false
// !false => true
// => "booleantrue"
