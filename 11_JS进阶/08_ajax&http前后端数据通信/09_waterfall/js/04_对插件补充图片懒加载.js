; (function (doc) {
  // 实现任意配置的瀑布流
  var Waterfall = function (wrapper, opt) {
    this.oWrapper = doc.getElementsByClassName(wrapper)[0];
    this.imgApi = opt.imgApi;
    this.column = opt.column;
    this.gap = opt.gap;
    this.pageNum = 0;
    this.pageSize = 0;
    // 存储每列高度
    this.heightArr = [];
    // 计算每个item宽度（容器宽度 - 间距总和 / 列数）
    this.itemWidth = (this.oWrapper.offsetWidth - (this.column - 1) * this.gap) / this.column;
    this.lazyImageboxs = [];
  }

  Waterfall.prototype = {
    init: function () {
      this.bindEvent();
      this.getImgDatas(this.pageNum);
    },

    bindEvent: function () {
      window.addEventListener('scroll', this.scrollToBottom.bind(this), false);
    },

    // 加载更多
    scrollToBottom: function () {
      var HTML = doc.documentElement;
      
      this.lazyAllImageBoxs();
      
      if (HTML.clientHeight + HTML.scrollTop >= HTML.scrollHeight) {
        this.pageNum++;

        if (this.pageNum <= this.pageSize - 1) {
          this.getImgDatas(this.pageNum);
        }
      }
    },

    getImgDatas: function (pageNum) {
      var _self = this;

      $.ajax({
        url: _self.imgApi,
        type: 'POST',
        dataType: 'JSON',
        data: {
          pageNum: pageNum
        },
        success: function (data) {
          if (data !== 'NO DATA') {
            var pageData = JSON.parse(data.pageData);
            _self.pageSize = +data.pageSize;
            _self.renderList(pageData, _self.pageNum);
          }
        }
      });
    },

    // render 和 设置图片位置结合，设置完更新数组高度
    renderList: function (data, pageNum) {
      var _self = this,
        oItems = null,
        minIdx = -1;

      data.forEach(function (elem, idx) {
        var oItem = doc.createElement('div'),
          oImg = new Image(),
          // 第一行 第一个 | 其他几个
          itemLeft = (idx + 1) % _self.column === 1 ? 0 : idx * (_self.itemWidth + _self.gap);

        oItem.className = 'wf-item';
        oItem.style.width = _self.itemWidth + 'px';
        oItem.style.height = _self.itemWidth * elem.height / elem.width + 'px';
        oImg.setAttribute('data-src', elem.img);
        // oImg.src = elem.img;

        oItem.appendChild(oImg);
        _self.oWrapper.appendChild(oItem);

        oItems = doc.getElementsByClassName('wf-item');

        // 第一行
        if (idx < _self.column && pageNum === 0) {
          _self.heightArr.push(oItem.offsetHeight);
          oItem.style.top = 0;
          oItem.style.left = itemLeft + 'px';
        } else {
          // 其余行
          minIdx = _self.getMinIdx(_self.heightArr);
          oItem.style.left = oItems[minIdx].offsetLeft + 'px';
          oItem.style.top = _self.heightArr[minIdx] + _self.gap + 'px';

          _self.heightArr[minIdx] += oItem.offsetHeight + _self.gap;
        }
        // oImg.style.opacity = 1;
      });

      // 渲染完成后更新懒加载列表（转换为数组）
      _self.lazyImageboxs = Array.from(doc.getElementsByClassName('wf-item'));
      // 立即检查一次懒加载（新渲染的图片可能已在视口内）
      _self.lazyAllImageBoxs();
    },

    getMinIdx: function (arr) {
      return [].indexOf.call(arr, Math.min.apply(null, arr));
    },

    // 单张图片延迟加载
    lazyImageLoad: function (lazyImageBox) {
      var img = lazyImageBox.getElementsByTagName('img')[0],
        dataSrc = img.getAttribute('data-src');
      img.onload = function () {
        img.style.opacity = 1;
      };
      img.src = dataSrc;
      lazyImageBox.isLoad = true;
    },

    lazyAllImageBoxs: function () {
      var winH = doc.documentElement.clientHeight,
        _self = this;

      // 循环所有盒子
      _self.lazyImageboxs.forEach(function (elem) {
        if (elem.isLoad) return;
        var elemH = elem.getBoundingClientRect().bottom;

        if (elemH <= winH + 100) {
          _self.lazyImageLoad(elem);
        }
      });
    }
  };

  window.Waterfall = Waterfall;

})(document);