; (function (doc, win) {
  var columns = Array.from(doc.getElementsByClassName('column')),
    loadMoreBox = doc.getElementsByClassName('load-more')[0],
    data = JSON.parse(doc.getElementsByClassName('J_data')[0].innerHTML),
    tpl = doc.getElementById('J_imgTpl').innerHTML;

  // 全局 IntersectionObserver，只创建一次
  var lazyImageBoxOb = null;

  var init = function () {
    renderList(data);
    // 刚开始加载页面，500ms 之后执行图片懒加载
    setTimeout(function () {
      observeAllImageBox();
    }, 500);
    loadMore();
  }

  var renderList = function (data) {
    data = data.map(item => {
      var AW = 240,
        BW = item.width,
        BH = item.height,
        AH = AW / (BW / BH);
      item.width = AW;
      item.height = AH;
      return item;
    });

    var dataLen = data.length,
      list = '',
      group;

    for (var i = 0; i < dataLen; i += 5) {
      group = data.slice(i, i + 5);

      group.sort((a, b) => a.height - b.height);

      columns.sort((a, b) => b.offsetHeight - a.offsetHeight);

      group.forEach((item, index) => {
        list = tpl.replace(/{{(.*?)}}/g, function (node, key) {
          return {
            pic: item.pic,
            title: item.title,
            link: item.link,
            width: item.width,
            height: item.height
          }[key];
        });
        columns[index].innerHTML += list; // 追加每一项的内容
      });
    }
  }

  var LazyImageLoad = function LazyImageLoad(lazyImageBox) {
    if (lazyImageBox.isLoad) return;

    var img = lazyImageBox.getElementsByTagName('img')[0],
      dataSrc = img.getAttribute('data-src');

    if (!dataSrc) return; // 没有data-src就不处理

    img.onload = function () {
      img.style.opacity = 1;
    };
    img.src = dataSrc;
    img.removeAttribute('data-src');
    lazyImageBox.isLoad = true;
  }

  var observeAllImageBox = function observeAllImageBox() {
    // 获取所有图片的盒子
    var lazyImageBoxs = Array.from(doc.getElementsByClassName('item-img')),
      options = {
        threshold: [1]
      };

    /* 
    “加载更多时有图片丢失”和“回头滚动图片又丢失”的问题
      1.IntersectionObserver 只创建一次，避免重复监听和回调
        + 每次调用 observeAllImageBox 都会创建一个新的 IntersectionObserver 实例，并为所有未加载的图片盒子重新监听
        + 再次监听已经监听过的图片，导致图片多次被监听，有的图片没有监听就被移除监听
        + 没有 data-src 导致之前加载成功的图片加载失败
      2.懒加载时只处理未加载的图片盒子。
      3.observer 回调里加判断，避免重复加载和 data-src 丢失导致的图片丢失。
    */
    // 只创建一次 observer
    if (!lazyImageBoxOb) {
      lazyImageBoxOb = new IntersectionObserver(function (changes) {
        changes.forEach(function (item) {
          if (item.isIntersecting) {
            LazyImageLoad(item.target);
            lazyImageBoxOb.unobserve(item.target);
          }
        });
      }, options);
    }

    // 只 observe 未加载的图片盒子
    lazyImageBoxs = lazyImageBoxs.filter(item => !item.isLoad);
    lazyImageBoxs.forEach(lazyImageBox => {
      lazyImageBoxOb.observe(lazyImageBox);
    });
  }

  var loadMore = function loadMore() {
    var options = {
      threshold: [0]
    },
      loadMoreOb;

    loadMoreOb = new IntersectionObserver(function (changes) {
      var item = changes[0];
      if (item.isIntersecting) {
        renderList(data);
        observeAllImageBox();
      }
    }, options);
    loadMoreOb.observe(loadMoreBox);
  }

  init();
})(document, window);