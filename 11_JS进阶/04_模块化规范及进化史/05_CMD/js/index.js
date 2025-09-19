// 使用
seajs.use(['./js/A.js', './js/B.js', './js/C.js'], function(moduleA, moduleB, moduleC){
  console.log(moduleA.a); // [5, 4, 3, 2, 1]
  console.log(moduleB.b); // [5, 4, 3, 2, 1, 6, 7, 8, 9, 10]
  console.log(moduleC.c); // 5-4-3-2-1-6-7-8-9-10
});