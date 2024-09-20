let BModule = (function () {
  // B模块中需要依赖A模块中的sum方法
  let name = "hezi";
  const average = function average(...params) {
    let len = params.length,
      total = AModule.sum(...params);
    if (len === 0) return 0;
    return (total / len).toFixed(2);
  };

  // window.average = average;
  return {
    average
  };
})();