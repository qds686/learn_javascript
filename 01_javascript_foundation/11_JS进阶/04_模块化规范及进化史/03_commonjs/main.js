/* 
CommonJS模块规范「模块的导入和导出」：Node自带的模块规范(浏览器端不支持)
  + 定义模块：创建每一个JS文件，就是定义一个单独的模块,每个模块之间的代码本身就是私有的！！！
  + 导出模块中的方法：
    module.exports = {
      // 包含需要供外部调用的属性和方法
    };
  + 导入指定得分模块
    const X = require('模块地址，导入自己的模块需要加./');
    基于x接收导出的对象，后期基于x.xxx即可访问
  
  CommonJS模块的导入是“按需”的，随时用随时导入即可，不像AMD都需要前置处理！
  CommonJS规范比AMD用起来更简单，从导入机制等原理上，也比AMD性能高一些

  但是CommonJS不支持浏览器端，所以 淘宝玉伯 写了一个插件 sea.js「本质定义为CMD模块规范」
    + 本质：把CommonJS规范搬到浏览器端运行
  再到后来 ES6本身就提供了高能耗用的模块规范：ES6Module，sea.js代表的CMD规范就被pass了
*/
const A = require('./A');
const B = require('./B');

console.log(A.sum(10, 20, 30, 40, 50)); // 150
console.log(B.average(10, 20, 30, 40, 50)); // 30.00
// node main.js