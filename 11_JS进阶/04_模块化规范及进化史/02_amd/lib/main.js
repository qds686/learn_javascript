// 入口文件
require.config({
  baseUrl: './lib'
});

// 导入指定模块，然后处理相关的内容
require(['A', 'B'], function (A, B) {
  console.log(A.sum(10, 20, 30, 40, 50)); // 150
  console.log(B.average(10, 20, 30, 40, 50)); // 30.00
});

// 引用require.js报错
// Refused to execute script from 'http://xx.xx.xx/yy/zz.js' because its MIME type ('') is not executable, and strict MIME type checking is enabled.
// javascript请求的内容返回的MIME类型为''，不是可执行的文件，目前已启用了严格的MIME类型检查。（故而，该文件加载失败）
// 解决方案：参见https://www.cnblogs.com/johnnyzen/p/14233058.html 

