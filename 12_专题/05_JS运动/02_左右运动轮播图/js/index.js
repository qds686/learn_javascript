; (function () {
  var Slider = function () {
    this.slider = document.getElementsByClassName('slider')[0];
    this.sliderList = document.getElementsByClassName('J-slider-list')[0];
    this.tabList = document.getElementsByClassName('J-tab-list')[0];
    this.tabItems = Array.from(document.getElementsByClassName('tab-item'));
    this.btnPrev = document.getElementsByClassName('btn-prev')[0];
    this.btnNext = document.getElementsByClassName('btn-next')[0];
    this.tpl = document.getElementById('J-tpl').innerHTML;
    this.data = [
      { "id": 0, "images": "images/1.jpg" },
      { "id": 1, "images": "images/2.webp" },
      { "id": 2, "images": "images/3.webp" },
      { "id": 3, "images": "images/4.webp" },
      { "id": 4, "images": "images/1.jpg" }
    ];
    this.timer = null;
    this.idx = 0;
    this.interval = 3000;
  }

  Slider.prototype = {
    init() {
      this.render();
      this.autoPlay();
      this.bindEvent();
    },
    bindEvent() {
      var _self = this;
      // 鼠标进入到容器中，停止自动轮播，鼠标离开后，我们需要再次开启自动轮播
      addEvent(this.slider, 'mouseenter', function () {
        clearInterval(_self.timer);
      });
      addEvent(this.slider, 'mouseleave', function () {
        _self.autoPlay();
      });
      // 点击分页器实现切换，事件代理
      addEvent(this.tabList, 'click', this.tabClick.bind(_self));

      // 点击导航按钮切换
      // 点击右按钮，只需要切换到下一张，当离开slider区域再进行自动轮播
      addEvent(this.btnNext, 'click', function () {
        clearInterval(_self.timer);   // 先清除旧定时器
        _self.sliderAction('right');  // 切换到下一张
      });
      addEvent(this.btnPrev, 'click', function () {
        clearInterval(_self.timer);   // 先清除旧定时器
        _self.sliderAction('left');   // 切换到下一张
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
    // 自动轮播切换
    autoPlay() {
      var _self = this;

      // 开始加载页面，控制其间隔3000MS自动切换一次
      _self.timer = setInterval(function () {
        _self.sliderAction('right');
      }, _self.interval);
    },
    // 切换轮播图到下一张或者上一张
    sliderAction(direction) {
      var _self = this,
        maxIdx = _self.data.length - 1;

      if (direction === 'right') {
        if (_self.idx >= maxIdx) {
          // 当前展示的已经是最后一张（克隆的这一张），此时不能继续++，需要让其立即运动到真实的第一张
          _self.idx = 0;
          _self.sliderList.style.transitionDuration = '0s';
          _self.sliderList.style.left = '0px';
          // 基于获取样式“刷新渲染队列”，先渲染到第一张
          _self.sliderList.offsetLeft;
        }
        _self.idx++;
      } else if (direction === 'left') {
        if (_self.idx <= 0) {
          // 当前展示第一张的时候，点击左按钮，立即运动到最后一张图片
          _self.idx = maxIdx;
          _self.sliderList.style.transitionDuration = '0s';
          _self.sliderList.style.left = `${-_self.idx * 1200}px`;
          _self.sliderList.offsetLeft;
        }
        // 再次点击idx--，向左切换
        _self.idx--;
      }

      // 动画切换
      _self.sliderList.style.transitionDuration = '.3s';
      _self.sliderList.style.left = `${-_self.idx * 1200}px`;

      // 切换完成控制分页器对齐
      _self.paginationFocus();
    },
    // 控制分页器对齐
    paginationFocus() {
      var _self = this,
        temp = _self.idx;

      temp === 4 ? temp = 0 : null;

      _self.tabItems.forEach(function (item) {
        item.className = 'tab-item';
        return;
      });
      _self.tabItems[temp].className += ' cur';
    },
    // 给tabList做事件代理
    tabClick(e) {
      var _self = this,
        e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className,
        oParent = tar.parentNode,
        // idx = Array.prototype.indexOf.call(_self.tabItems, oParent),
        idx = _self.tabItems.findIndex(item => item === oParent);

      // 点击当前这一项不进行切换 或者 当前展示的是克隆图即第一张的图，我点击第一张不进行切换
      if (idx === _self.idx || (_self.idx === 4 && idx === 0)) return;

      if (className === 'indicator') {
        // 同步当前索引
        _self.idx = idx;
        // 切换
        _self.sliderList.style.transitionDuration = '.3s';
        _self.sliderList.style.left = `${-idx * 1200}px`;
        // 分页器对齐
        _self.paginationFocus();
      }
    }
  };

  new Slider().init();
})();