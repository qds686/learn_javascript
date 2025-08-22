/* 
  瀑布流原理：
  1.确定第一行的排列（每行5张）
  2.保存5张图片的盒子的高度到数组
  3.第6张图片开始找最小盒子高度的那一列排（通过第一行保存的数组）
  4.排一张图片，修改一次数组相应列的下标的值

  PS：数据绑定和设置图片位置分开的方案
*/

; (function (doc) {

  var oWrap = doc.getElementsByClassName('js_wrap')[0],
    loadMore = doc.getElementsByClassName('load-more')[0],
    wfWaterTpl = doc.getElementById('wfItemTpl').innerHTML,
    data = JSON.parse(doc.getElementsByClassName('J_data')[0].innerHTML),
    _arr = [],
    // 添加加载状态标记
    isLoading = false,
    // 记录上一次处理到的元素数量（关键变量）
    lastItemCount = 0;

  var init = function () {
    renderList(data);
    // 第一次处理初始元素
    setImgPos();
    setTimeout(lazyAllImageBoxs, 500);
    scrollToBottom();
  }

  function renderList(data) {
    var list = '',
      tempDiv = doc.createElement('div');

    data.forEach(function (elem) {
      list = wfWaterTpl.replace(/{{(.*?)}}/g, function (node, key) {
        return {
          pic: elem.pic,
          height: 232 * elem.height / elem.width
        }[key];
      });
      tempDiv.innerHTML += list;
    });
    oWrap.appendChild(tempDiv);
  }

  // 实现瀑布流布局
  // 只处理新增的元素，基于最新的_arr计算位置
  function setImgPos() {
    var oItems = doc.getElementsByClassName('wf-item'),
      oItemsLen = oItems.length,
      item;

    for (var i = lastItemCount; i < oItemsLen; i++) {
      item = oItems[i];
      item.style.width = '232px';

      // 第一行
      if (i < 5) {
        // 初始化 _arr 存储每列初始高度
        _arr.push(item.offsetHeight);

        item.style.top = '0';
        // 第一行第一个
        if ((i + 1) % 5 === 1) {
          item.style.left = '0';
        } else {
          // 第一行后几个
          item.style.left = i * (232 + 10) + 'px';
        }
      } else {
        // 非第一行：基于当前_arr找最小高度列
        var minIdx = getMinIdx(_arr);

        // 设置新元素的位置（放在最小高度列的下方，间距10px）
        item.style.left = oItems[minIdx].offsetLeft + 'px';
        item.style.top = _arr[minIdx] + 10 + 'px';
        // 更新该列的总高度（加上当前元素高度和间距）
        _arr[minIdx] += item.offsetHeight + 10;
      }
    }

    // 关键修改：设置load-more位置
    if (_arr.length > 0) {
      // 取数组中的最大高度（瀑布流当前总高度）
      var maxHeight = Math.max.apply(null, _arr);
      // 将load-more放在最大高度下方，距离10px
      loadMore.style.position = 'absolute';
      loadMore.style.top = maxHeight + 10 + 'px';
      loadMore.style.left = '0';
      loadMore.style.width = '100%';
      loadMore.style.height = '50px';
    }

    // 更新上次处理到的元素数量（下次从这里开始）
    lastItemCount = oItemsLen;
  }

  function getMinIdx(arr) {
    // 最小值在数组中的索引
    return [].indexOf.call(arr, Math.min.apply(null, arr));
  }

  // 单张图片延迟加载
  function lazyImageLoad(lazyImageBox) {
    var img = lazyImageBox.getElementsByTagName('img')[0],
      dataSrc = img.getAttribute('data-src');
    img.onload = function () {
      img.style.opacity = 1;
    };
    img.src = dataSrc;
    lazyImageBox.isLoad = true;
  }

  // 使用IntersectionObserver 监听器
  function lazyAllImageBoxs() {
    // 获取所有图片的盒子
    var lazyImageBoxs = Array.from(doc.getElementsByClassName('wf-item')),
      options = {
        threshold: [0.5]
      },
      ob;
    ob = new IntersectionObserver(function (changes) {
      changes.forEach(function (item) {
        if (item.isIntersecting) {
          lazyImageLoad(item.target);
          ob.unobserve(item.target);
        }
      });
    }, options);

    // 只 observe 未加载的图片盒子
    lazyImageBoxs = lazyImageBoxs.filter(item => !item.isLoad);
    lazyImageBoxs.forEach(lazyImageBox => {
      ob.observe(lazyImageBox);
    });
  }

  function scrollToBottom() {
    var ob,
      options = {
        threshold: [0]
      };

    ob = new IntersectionObserver(function (changes) {
      var item = changes[0];

      if (item.isIntersecting && !isLoading) {
        isLoading = true;
        // 加载更多数据
        renderList(data);
        setImgPos();
        lazyAllImageBoxs();
        // 加载完成后重置状态
        setTimeout(() => isLoading = false, 500);
      }
    }, options);
    ob.observe(loadMore);
  }

  window.onload = function () {
    init();
  }

})(document);