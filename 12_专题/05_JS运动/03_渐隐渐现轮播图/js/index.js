; (function () {
  var Slider = function () {
    this.slider = document.getElementsByClassName('slider')[0];
    this.sliderList = document.getElementsByClassName('J-slider-list')[0];
    this.sliderListItems = document.getElementsByClassName('list-item');
    this.tabList = document.getElementsByClassName('J-tab-list')[0];
    this.tabItems = Array.from(document.getElementsByClassName('tab-item'));
    this.btnPrev = document.getElementsByClassName('btn-prev')[0];
    this.btnNext = document.getElementsByClassName('btn-next')[0];
    this.tpl = document.getElementById('J-tpl').innerHTML;
    this.data = [
      { "id": 0, "images": "images/1.jpg" },
      { "id": 1, "images": "images/2.webp" },
      { "id": 2, "images": "images/3.webp" },
      { "id": 3, "images": "images/4.webp" }
    ];
    /* 
      timer：记录自动切换定时器的返回值
      interval：记录多久自动切换一次「单位ms」
      idx：记录当前展示slide的索引
      prev：记录上一个展示slide的索引
      maxIdx: slider数量
    */
    this.timer = null;
    this.interval = 2000;
    this.idx = 0;
    this.prev = this.idx;
    this.maxIdx = this.data.length - 1;
  }

  Slider.prototype = {
    init() {
      this.render();
      this.defaultShow();
      this.autoPlay();
      this.bindEvent();
    },
    bindEvent() {
      var _self = this;
      // 鼠标进入到容器中，停止自动轮播，鼠标离开后，我们需要再次开启自动轮播
      addEvent(this.slider, 'mouseenter', function () {
        if (_self.timer) {
          clearInterval(_self.timer);
          _self.timer = null;
        }
      });
      addEvent(this.slider, 'mouseleave', function () {
        _self.autoPlay();
      });
      // 在浏览器页卡隐藏和显示的时候，控制定时器暂停和开启
      addEvent(document, 'visibilitychange', function () {
        if (document.hidden) {
          // 当前页卡隐藏了
          if (_self.timer) {
            clearInterval(_self.timer);
            _self.timer = null;
          }
          return;
        }
        // 当前页卡显示了
        _self.autoPlay();
      });
      // 点击分页器实现切换，事件代理
      addEvent(this.tabList, 'click', this.tabClick.bind(_self));

      addEvent(this.btnNext, 'click', function () {
        clearInterval(_self.timer);   // 先清除旧定时器
        _self.moveRight();  // 切换到下一张
      });
      addEvent(this.btnPrev, 'click', function () {
        clearInterval(_self.timer);   // 先清除旧定时器
        _self.moveLeft();   // 切换到上一张
      });
    },
    // 绑定数据和页面结构
    render() {
      var _self = this,
        len = _self.data.length,
        list = '',
        item;

      for (var i = 0; i < len; i++) {
        item = _self.data[i];

        list += this.tpl.replace(/{{(.*?)}}/g, function (node, key) {
          return {
            images: item.images
          }[key];
        });
        _self.sliderList.innerHTML = list;
      }
    },
    defaultShow() {
      var _self = this;

      _self.sliderListItems[_self.idx].style.cssText = 'z-index:1;opacity:1';
      // _self.tabItems[_self.idx].className = 'tab-item cur';
    },
    // 分页器对齐
    paginationFocus() {
      var _self = this,
        temp = _self.idx;
      _self.tabItems.forEach(function (item) {
        item.className = 'tab-item';
      });
      _self.tabItems[temp].className += ' cur';
    },
    // 自动轮播切换
    autoPlay() {
      var _self = this;

      _self.timer = setInterval(function () {
        _self.moveRight();
      }, _self.interval);
    },
    moveRight() {
      var _self = this;
      _self.idx++;
      if (_self.idx > _self.maxIdx) _self.idx = 0;
      _self.move();
    },
    moveLeft() {
      var _self = this;
      _self.idx--;
      if (_self.idx < 0) _self.idx = _self.maxIdx;
      _self.move();
    },
    move() {
      var _self = this,
        slideNow = _self.sliderListItems[_self.idx],
        slidePrev = _self.sliderListItems[_self.prev];
      // 先改层级
      slideNow.style.zIndex = 1;
      slidePrev.style.zIndex = 0;
      // 再改透明度
      slideNow.style.transitionDuration = '0.3s';
      slideNow.style.opacity = 1;
      slideNow.ontransitionend = function () {
        slidePrev.style.transitionDuration = '0s';
        slidePrev.style.opacity = 0;
      };
      // 当前展示索引就是下一个要展示的上一张
      _self.prev = _self.idx;
      // 分页器对齐 
      _self.paginationFocus();
    },
    tabClick() {
      var _self = this;

      _self.tabItems.forEach((item, index) => {
        item.onclick = function () {
          if (_self.idx === index) return;
          _self.idx = index;
          _self.move();
        };
      });
    }
  };

  new Slider().init();
})();