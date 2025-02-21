// 一、元字符
// 1.转义和转义字符
// 转义：转换意义、改变意义
// 转义符号：\  转义字符：\字符

// 1.1 两个字符串中间的变量
// 报错：Uncaught SyntaxError: Unexpected identifier '牛逼' 
// 原因：引号里面嵌套相同的引号，前后会形成两个单独的字符串，中间是一个变量，变量两边没有加号进行拼接，所以会导致语法错误，字符串拼接失败。
// var str = "我是一名" 牛逼 "的程序员"; 

// 给变量两边加上“+”
// 报错：Uncaught ReferenceError: 牛逼 is not defined
// 原因：没有提前定义变量
// var str = "我是一名" + 牛逼 + "的程序员"; 

var 牛逼; // 值是牛逼结果也是undefined
var str = "我是一名" + 牛逼 + "的程序员";
// console.log(str); // 不报错，我是一名undefined的程序员

// 1.2 转义符号的运用
// 把引号变成一个字符
var str = "我是一名\"牛逼\"的程序员";
// console.log(str); // 我是一名"牛逼"的程序员

// \\：把\转义为字符
var str = "我是一名\\牛逼\\的程序员";
// console.log(str); // '我是一名\牛逼\的程序员'

// 2. 常见的转义字符：\n \r \t
// @1 \n：换行 \r：回车
// @2 系统中按下回车：Windows: \r\n, Mac: \r, linux: \n
// @3 \n \r \t是给编辑系统识别的，不是给html用的
// @4 html是文本会把多行字符只显示一个空格
// @5 控制台中会显示换行
var str = "我是一名\n牛逼\n的程序员"
// document.write(str);// 我是一名 牛逼 的程序员

// \t：制表符 
// html中识别成一个空格
var str = "我是一名\t\t牛逼的程序员"; // 我是一名  牛逼的程序员
// document.write(str); // 我是一名 牛逼的程序员

// 2.1 JavaScript不允许字符串多行，会报错
// 转义回车换行，显示成后面的空格了
var str = '<h1>我是一个盒子</h1>\
          <h2>我在学习JavaScript</h2>\
          <h3>我要成为最牛逼的程序员</h3 > ';
// 按照标签内容在HTML中正常显示
// 我是一个盒子
// 我在学习JavaScript
// 我要成为最牛逼的程序员
document.body.innerHTML = str; 
// 控制台中转义变为符合后面的空格
// console.log(str); // <h1>我是一个盒子</h1>          <h2>我在学习JavaScript</h2>          <h3>我要成为最牛逼的程序员</h3 >

// 3.特殊的元字符
// 3.1 \w===[0-9A-z_] \W===[^\w]
















