; (function () {
  // 获取窗口的高度
  var wHeight = getViewportSize().height,
    // 获取整个文档的高度
    sHeight = getScrollSize().height,
    playing = false,
    t = null;

  var AutoReader = function (opt) {
    this.playBtn = opt.playBtn;
    this.sTopBtn = opt.sTopBtn;
    this.playImg = opt.playImg;
    this.pauseImg = opt.pauseImg;

    if(!this.playBtn || !this.sTopBtn || !this.playImg || !this.pauseImg){
      console.log('对不起，4个配置项必须全部配置');
      return;
    }

    var _self = this;
    addEvent(this.sTopBtn, 'click', function () {
      window.scrollTo(0, 0);
      clearInterval(t);
      _self.playBtn.style.backgroundImage = _self.playImg;
      playing = false;
    });

    addEvent(window, 'scroll', function () {
      _self.sTopBtnShow.call(_self);
    });

    addEvent(this.playBtn, 'click', function () {
      // _self指向构造函数
      _self.setAutoPlay();
    });
  }
  AutoReader.prototype = {
    setAutoPlay: function () {
      var sTop = getScrollOffset().top,
        _self = this;
      // 如果滚动到底部，点击不起作用
      if (sHeight === wHeight + sTop) {
        return;
      }
      // 没有滚动，点击设置定时器开始滚动
      if (!playing) {
        t = setInterval(function () {
          var sTop = Math.round(getScrollOffset().top);

          // 滚动到底部
          console.log(sHeight + 44,wHeight, sTop)
          if (sHeight + 44 === wHeight + sTop) {
            clearInterval(t);
            _self.playBtn.style.backgroundImage = _self.playImg;
            playing = false;
          } else {
            window.scrollBy(0, 1);
            _self.playBtn.style.backgroundImage = _self.pauseImg;
          }
        }, 10);
        playing = true;
      } else {
        // 正在播放的时候点击
        clearInterval(t);
        _self.playBtn.style.backgroundImage = _self.playImg;
        playing = false;
      }
    },

    sTopBtnShow: function () {
      var sTop = getScrollOffset().top,
        sTopBtn = this.sTopBtn;

      sTopBtn.style.display = sTop ? 'block' : 'none';
    }
  };

  window.AutoReader = AutoReader;
})();