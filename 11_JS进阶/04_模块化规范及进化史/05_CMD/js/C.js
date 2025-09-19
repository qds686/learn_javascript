define(function (require, exports, module) {
  var moduleB = require('./B');

  return {
    c: moduleB.b.join('-')
  }
});