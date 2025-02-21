// define：定义模块
define(function () {
  'use strict';
  let name = "盒子";
  const sum = function sum(...params) {
    let len = params.length;
    if (len === 0) return 0;
    if (len === 1) return +params[0];
    return params.reduce((res, item) => +res + (+item));
  };

  return {
    sum
  };
});
