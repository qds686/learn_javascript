// AMD思想的优势：定义模块的时候，可以把依赖的模块“前置导入”
// 回调函数中基于AModule接收导入的A模块内容(A模块中返回的对象)
define(['A'],function (AModule) {
  'use strict';
  let name = "hezi";
  const average = function average(...params) {
    let len = params.length,
      total = AModule.sum(...params);
    if (len === 0) return 0;
    return (total / len).toFixed(2);
  };

  return {
    average
  };
});