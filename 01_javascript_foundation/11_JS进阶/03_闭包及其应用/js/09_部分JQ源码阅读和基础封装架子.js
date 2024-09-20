/* 
JS可以执行的环境：
1.浏览器环境「或者webview」
  <script src="xxx.js">
  存在window
  ES6Module模块规范「import export」
  不支持CommonJS模块规范「exports require」
2.Node.js环境
  基于CommonJS模块规范实现模块的导入导出
  不存在window，全局对象叫做global
  不支持ES6Module规范
  支持CommonJS模块规范
3.Webpack环境
  基于Node去实现代码的打包，最后交给浏览器运行
  存在window
  支持ES6Module和CommonJS规范
*/
// JQuery源码分析-环境处理
(function (global, factory) {
  // 开启严格模式
  "use strict";
  /* 
  global
    + 浏览器&webpack：global -> window
    + Node：global -> global全局对象「this」/ 当前模块「在代码中运行」
  factory：回调函数
  */

  // 1.判断是否支持CommonJS规范，区分运行环境
  if (typeof module === "object" && typeof module.exports === "object") {
    /* 
    1.1支持CommonJS模块规范：运行在Node 或者 Webpack环境下 
      + global.document存在：则global是window，说明是Webpack环境下 => 把factory执行的返回结果，基于module.exports导出 => module.exports=jQuery
        const $ = require('jquery')=> $===jQuery
      + 不存在：Node环境 => module.exports导出一个函数，函数执行如果无法提供window对象，则报错，也说明 “JQ不支持在Node中运行”
    */
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error("jQuery requires a window with a document");
        }
        return factory(w);
      };
  } else {
    // 1.2不支持CommonJS模块规范：运行在浏览器环境下
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  /* 
  factory(global) => 在浏览器中运行：window -> window noGlobal -> undefined
    <script src="jquery.js">
    <script>
      $()
      jQuery()
    </script>

  在Webpack中运行：window -> window noGlobal -> true
  */

  var version = "3.6.0",
    jQuery = function (selector, context) {
      // ...；
    };
  var _jQuery = window.jQuery,
    _$ = window.$;

  jQuery.noConflict = function (deep) {
    if (window.$ === jQuery) {
      window.$ = _$;
    }

    if (deep && window.jQuery === jQuery) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  };
  // ...
  if (typeof noGlobal === "undefined") {
    window.jQuery = window.$ = jQuery;
  }
  return jQuery;
});