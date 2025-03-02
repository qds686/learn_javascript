// 1. at
/**
 * 
 * 参数：整数，要返回的字符串字符的索引（位置）
 *   + 正整数和负整数，负整数从字符串中的最后一个字符开始倒数
 * 返回：由位于指定位置的单个 UTF-16 码元组成的 String。如果找不到指定的索引，则返回 undefined
 */

// 1.1 返回字符串的最后一个字符
// 返回给定字符串的最后一个字符的函数
function returnLast(arr) {
  return arr.at(-1);
}

let invoiceRef = "myinvoice01";

console.log(returnLast(invoiceRef));
// Logs: '1'

invoiceRef = "myinvoice02";

console.log(returnLast(invoiceRef));
// Logs: '2'

// 1.2 方法对比
// 下面我们通过比较不同的方法来实现选择 String 的倒数第二个字符。
// 尽管以下所有方法都是有效的，但它们凸显了 at() 方法的简洁性和可读性。

const myString = "Every green bus drives fast.";

// @1 使用 length 属性和 charAt() 方法
const lengthWay = myString.charAt(myString.length - 2);
console.log(lengthWay); // 't'

// @2 使用 slice() 方法
const sliceWay = myString.slice(-2, -1);
console.log(sliceWay); // 't'

// @3 使用 at() 方法
const atWay = myString.at(-2);
console.log(atWay); // 't'

// 2.charAt 通过下标取值
var str = 'jiucaihezi';

// 2.1 通过下标取值
var res1 = str.charAt(0);
console.log(res1); // "j"

// 2.2 如果找不到，返回值是空串
var res2 = str.charAt(12);
console.log(res2); // ""

// 2.3 如果直接是索引去取值，找不到，返回是undefined
var res3 = str[12];
console.log(res3); // 'undefined'

// 3. charCodeAt 通过下标取值对应的ASCII码值
var str = 'jiucaihezi';

// 3.1 通过下标取值对应的ASCII码值
var res = str.charCodeAt(0); // "j"==>ASCII码
console.log(res);// 106

// 3.2 字符串遍历
// for循环
for (var i = 0; i < str.length; i++) {
  // console.log(str[i]); // 'j' 'i' 'u' 'c' 'a' 'i' 'h' 'e' 'z' 'i'
}

// for..of循环
// for..of的遍历 -> 迭代器
// 目前可迭代对象: 字符串/数组
// 对象是不支持for..of
// String对象内部是将字符串变成了一个可迭代对象
for (var char of str) {
  // console.log(char); //  'j' 'i' 'u' 'c' 'a' 'i' 'h' 'e' 'z' 'i'
}

// 需求：接收任意一个字符串，算出这个字符串的总字节数
var getBytes = function getBytes(str){
  var len = str.length,
      byte = 0;
  if(typeof str !== 'string') return;
  for(var i = 0; i < len; i++){
    var code = str.charCodeAt(i);
    if(code < 255){
      byte++;
    }else {
      byte += 2;
    }
  }
  return byte;
};
console.log(getBytes('我爱编程'));

// 4. indexOf / lastIndexOf
// 4.1 一个参数：找的内容
var str = 'jiucaihezi';
var res1 = str.indexOf('u');
console.log(res1); // 2

var res2 = str.lastIndexOf('i');
console.log(res2); // 9


// 4.2 两个参数：开始找的位置(indexOf) / 找到哪终止(lastIndexOf)
// 从下标3开始查找
var res3 = str.indexOf('i', 3);
console.log(res3); // 5

// 截止到下标4，停止查找
var res4 = str.lastIndexOf('i', 4);
console.log(res4); // 1

// 4.3 判断一个字符串中是否有另外一个字符串
// 1.indexOf(searchString, fromIndex)
/*
  index:
    情况一: 搜索到, 搜索字符串所在索引位置
    情况二: 没有搜索到, 返回-1
*/
// var index = message.indexOf(name); 
// if (message.indexOf(name) !== -1) {
//   console.log("message中包含name")
// } else {
//   console.log("message不包含name")
// }

// 2.includes: ES6中新增一个方法, 就是用来判断包含关系
// if (message.includes(name)) {
//   console.log("message中包含name")
// }

// 5.slice 
/**
 * 作用：查找字符串中特定位置的字符
 * 参数：[n,m)
 * 返回值：查找的字符
 *   + [n,m)
 *   + [n, m不写查找到结尾]
 *   + n不写或者写一个0，就是复制一份
 *   + 参数可以为负值，转换成整数的规律：str.length + 负的索引值
 */
var str = "yangfanqihang"

str.slice(1, 3) // "an"
str.slice(0) // 复制一份
str.slice() // 复制一份 
var res = str.slice(-3, -1);
console.log(res, str.length); // "an"

// 6.substring 
/**
 * 作用：从indexStart提取字符,直到（但不包括）indexEnd
 *   + [indexStart, 不写就提取到结尾]
 *   + 如果 indexStart = indexEnd，则 substring() 返回一个空字符串
 *   + 如果 indexStart > indexEnd，则 substring() 的效果就像交换了这两个参数一样
 * 参数：(indexStart, indexEnd)
 *   + indexStart:返回子字符串中第一个要包含的字符的索引
 *   + indexEnd:返回子字符串中第一个要排除的字符的索引
 * 返回值：包含给定字符串的指定部分的新字符串
 * 
 * PS:
 * 任何小于 0 或大于 str.length 的参数值都会被视为分别等于 0 和 str.length
 * 任何值为 NaN 的参数将被视为等于 0。
 */

// 6.1 基本用法
var anyString = "Mozilla";

// 提取[m,n)
console.log(anyString.substring(0, 1)); // 'M'
console.log(anyString.substring(0, 6)); // 'Mozill'

// 开始大于结束，相当于参数交换
console.log(anyString.substring(1, 0)); // 'M'
console.log(anyString.substring(7, 4)); // 'lla'

// 如果结束不写，提取到字符串结尾
console.log(anyString.substring(4)); // 'lla'

// 如果结束的长度大于字符串的长度，默认提取到 str.length
console.log(anyString.substring(4, 7)); // 'lla'
console.log(anyString.substring(0, 7)); // 'Mozilla'
console.log(anyString.substring(0, 10)); // 'Mozilla'

// 6.2 调用 substring() 时使用 length 属性
// 使用 substring() 方法和 length 属性来提取特定字符串的最后字符。这种方法可能更容易记住，因为你不需要像上面的示例那样知道起始和结束索引
var text = "Mozilla";

// 获取字符串的最后 4 个字符
console.log(text.substring(text.length - 4)); // 打印“illa”

// 获取字符串的最后 5 个字符
console.log(text.substring(text.length - 5)); // 打印“zilla”

// 6.3 substring() 和 substr() 之间的区别
/* 
substring() 和 substr() 方法之间存在细微差别，因此你应该小心不要混淆它们。
  + substr() 方法的两个参数是 start 和 length，而 substring() 方法的参数是 start 和 end。
  + 如果 substr() 的 start 索引为负数，它将循环到字符串的末尾，而 substring() 会将其限制为 0。
  + 在 substr() 中，如果长度为负数，将被视为零；而在 substring() 中，如果 end 小于 start ，则会交换这两个索引。
此外，substr() 被认为是 ECMAScript 中的遗留特性，因此如果可能的话最好避免使用它，substr已被弃用
*/
var text = "Mozilla";
console.log(text.substring(2, 5)); // "zil"
console.log(text.substr(2, 3)); // "zil"

// 6.4 substring() 和 slice() 之间的区别

// substring() 和 slice() 方法几乎相同，但在处理负数参数时有一些细微差别。

// substring() 方法在 indexStart 大于 indexEnd 的情况下会交换它的两个参数，这意味着仍会返回一个字符串。而 slice() 方法在这种情况下返回一个空字符串。
var text = "Mozilla";
console.log(text.substring(5, 2)); // "zil"
console.log(text.slice(5, 2)); // ""

// 如果两个参数中的任何一个或两个都是负数或 NaN，substring() 方法将把它们视为 0。
console.log(text.substring(-5, 2)); // "Mo"
console.log(text.substring(-5, -2)); // ""

// slice() 方法也将 NaN 参数视为 0，但当给定负值时，它会从字符串的末尾开始反向计数以找到索引。
console.log(text.slice(-5, 2)); // ""
console.log(text.slice(-5, -2)); // "zil"

// 6.5 替换字符串中的子字符串
// 替换字符串中的子字符串。它可以替换单个字符和子字符串。示例的最后一个函数调用将字符串 Brave New World 更改为 Brave New Web。

// 将字符串 fullS 中的 oldS 替换为 newS
function replaceString(oldS, newS, fullS) {
  for (let i = 0; i < fullS.length; ++i) {
    if (fullS.substring(i, i + oldS.length) === oldS) {
      fullS =
        fullS.substring(0, i) +
        newS +
        fullS.substring(i + oldS.length, fullS.length);
    }
  }
  return fullS;
}

// replaceString("World", "Web", "Brave New World");

// 请注意，如果 oldS 本身是 newS 的子字符串，这可能导致无限循环，例如，假如你尝试在此处用 "OtherWorld" 替换 "World"。

// 替换字符串的更好方法如下：
function replaceString(oldS, newS, fullS) {
  return fullS.split(oldS).join(newS);
}
replaceString("World", "Web", "Brave New World");

// 上面的代码仅作为子字符串操作的示例。如果你需要替换子字符串，大多数情况下你会想要使用 String.prototype.replace() 函数。

// 7.toUpperCase()/toLowerCase() 把字符串转换为大小写

// 8.replace()字符串替换
/* 
  ● 作用：把字符串中某部分的字符替换成另一部分字符
  ● 参数：（str1，str2）第一个参数代表的是要替换的字符或者是正则；第二个参数代表的是替换后的字符
  ● 返回值：替换后的字符串
*/
var message = 'my name is hezi';
var newMessage = message.replace("hezi", "kobe")
console.log(message); // 'my name is hezi'
console.log(newMessage); // 'my name is kobe;

var newMessage = message.replace("hezi", function () {
  return newName.toUpperCase()
})
console.log(newMessage)

// 9.split
/* 
  ● 作用：按照指定的字符把字符串分割成数组
  ● 参数：分割符, 分割的次数
  ● 返回值：分割后的数组
*/
var str = "1-2-3";
var res = str.split("-");

console.log(res); // ["1", "2", "3"]

// 10.字符串拼接concat()和trim()
var str1 = "Hello"
var str2 = "World"
var str3 = "kobe"

// 1.字符串拼接
// +
var newString = str1 + str2 + str3
console.log(newString)

// concat方法: 链式调用
var newString2 = str1.concat(str2).concat(str3)
var newString3 = str1.concat(str2, str3, "abc", "cba")
console.log(newString2)
console.log(newString3)

//删除首位的空格
console.log("    why      abc   ".trim()) //why      abc

// 11. toString 和 valueOf
// valueOf 返回一个字符串，表示给定 String 对象的原始值
// String 对象重写了 Object 的 toString 方法，它不会继承 Object.prototype.toString()
// toString 方法返回字符串本身（如果它是原始值）或 String 对象封装的字符串。它的实现与 String.prototype.valueOf() 完全相同。