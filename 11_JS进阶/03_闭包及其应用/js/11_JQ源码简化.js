(function {
  const utils = {
    // ...
  };

  // 处理冲突：在Node和webpack中不存在冲突，保证导入的库定义的名字不重复即可，在浏览器中会重复
  // 保证在浏览器环境下
  if(typeof window !== "undefined"){
    // 用$保存现在谁在用
    let $ = window._;
    utils.noConflict = function noConflict(){
      if(window._ === utils){
        window._ = $;
      }
      return utils;
    }
  }

  // 导出API
  if (typeof window !== "undefined") window.utils = window._ = utils;
  if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
})();
/* 
浏览器
<script src='utils.js'>
<script>
  _.xxx();
  utils.xxx();
</script>

Node:
const utils = require('./utils.js');
utils.xxx();

Webpack:实现CommonJS和ES6Module的转换
import _ from './utils.js';
_.xxx();
*/