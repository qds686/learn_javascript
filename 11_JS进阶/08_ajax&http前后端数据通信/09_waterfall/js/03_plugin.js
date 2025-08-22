; (function (doc) {
  // 实现任意配置的瀑布流 + 加载更多(返回的几页数据，有限加载)
  var Waterfall = function (wrapper, opt) {
    this.oWrapper = doc.getElementsByClassName(wrapper)[0];
    this.imgApi = opt.imgApi;
    this.column = opt.column;
    this.gap = opt.gap;
    this.pageNum = 0;
    this.pageSize = 0;
    this.heightArr = [];
    this.itemWidth = (this.oWrapper.offsetWidth - (this.column - 1) * this.gap) / this.column;
  }

  Waterfall.prototype = {
    init: function () {
      this.bindEvent();
      this.getImgDatas(this.pageNum);
    },

    bindEvent: function () {
      window.addEventListener('scroll', this.scrollToBottom.bind(this), false);
    },

    scrollToBottom: function () {
      var HTML = doc.documentElement;

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
    // 这里可以给forEach第三个参数 this，优化_self
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
        oImg.src = elem.img;

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
        oImg.style.opacity = 1;
      });
    },

    getMinIdx: function (arr) {
      return [].indexOf.call(arr, Math.min.apply(null, arr));
    }
  };

  window.Waterfall = Waterfall;

})(document);