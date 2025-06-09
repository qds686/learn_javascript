; (function () {
  var Test = function (opt) {
    this.num1 = opt.num1;
    this.num2 = opt.num2;
    this.btnGroup = opt.btnGroup;
  }

  Test.prototype = {
    init: function () {
      this.bindEvent();
    },

    bindEvent: function () {
      var btns = this.btnGroup,
        _self = this;
      addEvent(btns, 'click', function (e) {
        _self.compute.call(_self, e);
      });
    },

    compute: function (e) {
      // this -> Test
      var e = e || window.event,
        tar = e.target || e.srcElement,
        val1 = Number(this.num1.value),
        val2 = Number(this.num2.value),
        btns = this.btnGroup,
        sign;

      sign = tar.getAttribute('data-sign');
      switch (sign) {
        case 'plus':
          console.log(val1 + val2);
          break;
        case 'minus':
          console.log(val1 - val2);
          break;
        case 'mal':
          console.log(val1 * val2);
          break;
        case 'div':
          console.log(val1 / val2);
          break;
        default:
          console.log('出错了！');
      }
    }
  }

  window.Test = Test;
})();