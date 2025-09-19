define(function (require, exports, module) {
  var moduleA = require('./A'),
      b = [6,7,8,9,10];

  return {
    b: moduleA.a.concat(b)
  };
});