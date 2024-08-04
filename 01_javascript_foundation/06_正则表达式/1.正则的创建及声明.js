// 一、正则表达式的概念
// 正则表达式（RegExp: regular expression）: 用来处理字符串的规则

// 1.只能处理字符串
// 2.它是一个规则：可以严重字符串是否符合某个规则，也可以把字符串中符合规则的内容捕获到（exec、match....）
// 3.正则表达式是一个对象
var reg = new RegExp();

// 4.字符串片段：大小写默认敏感 & 连续的
var reg = new RegExp('Test', 'i');
var str = 'This is a test';

// 二、正则表达式的创建方式
// 1.直接声明对象、字面量创建方式（两个斜杠之间包起来的，都是用来描述规则的元字符）
var str = 'This is a test. Test is important.';

var reg1 = /test/;
// console.log(reg1.test(str)); // true

var reg2 = /Test/;
// console.log(reg2.test(str)); // true

// 2.构造函数模式创建两个参数：元字符字符串，修饰符字符串
var reg = new RegExp("\\d+", 'i');
// console.log(reg); // /\d+/i

// 三、正则字面量和实例化声明的区别
// 1.变量处理

/**
 * 区别：
 *   1.字面量创建的正则 “两个斜杠中间包起来的都是元字符”
 *     构造函数创建的正则 “传递的是字符串”，\需要写两个才表示斜杠
 *   2.如果正则中要包含某个变量的值，则不能使用字面量的方式创建
 *     这种情况只能使用构造函数方式（因为它传递的规则是字符串，只有这样才能进行字符串拼接）
 */

// 字面量创建
var reg1 = /\d+/g;
// 正则表达式用实例化对象（构造函数）的方式声明
var reg2 = new RegExp("\\d+", "g");
// console.log(reg1, reg2); // /\d+/g /\d+/g

var v = 'Test';
var reg3 = new RegExp(v, 'i');
// console.log(reg3); // /Test/i

var str = 'This is a test.';
// console.log(str.match(reg3)); // ['test', index: 10, input: 'This is a test.', groups: undefined]

// 2.声明的对象不是一个引用
// 2.1 new正则
var reg1 = /test/;
var newReg = new RegExp('test');
// console.log(reg1, newReg); // /test/ /test/
// console.log(reg1 === newReg); // false

// 2.2 没有new
var reg2 = /test/;
var newReg = RegExp('test');
// console.log(reg2, newReg); // /test/ /test/
// console.log(reg2 === newReg); // false

reg2.a = 1;
// console.log(reg2.a, newReg.a); // 1 undefined

// 2.3 引用了字面量的地址并实例化
var reg3 = /test/;
var newReg = new RegExp(reg3);
// console.log(reg3 === newReg); // false
reg3.a = 1;
// console.log(reg3.a, newReg.a); // 1 undefined

// 2.4 引用了字面量的地址
var reg4 = /test/;
var newReg = RegExp(reg4);
// console.log(reg4 === newReg); // true

reg4.a = 1;
// console.log(reg4.a, newReg.a); // 1 1
