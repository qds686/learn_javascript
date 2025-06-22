; (function (doc, win) {
  // 获取所有DOM元素
  var columns = Array.from(doc.getElementsByClassName('column')),
    data = JSON.parse(doc.getElementsByClassName('J_data')[0].innerHTML),
    tpl = doc.getElementById('J_imgTpl').innerHTML,
    lazyImageBoxs = [];

  // 初始化数据
  var init = function () {
    // 数据绑定
    renderList(data);
    // 500ms 之后执行图片懒加载
    setTimeout(lazyAllImageBoxs, 500);
    bindEvent();
  }

  // 执行绑定事件
  var bindEvent = function () {
    win.onscroll = throttle(function () {
      // 图片延迟加载
      lazyAllImageBoxs();

      // 下拉加载更多数据
      var HTML = doc.documentElement;
      if((HTML.clientHeight + HTML.scrollTop + 100) >= HTML.scrollHeight) {
        renderList(data);
        lazyAllImageBoxs();
      }
    });
  }

  // 函数节流
  const throttle = function throttle(func, wait) {
    // init params
    if (typeof func !== 'function') throw new TypeError('func is not a function');
    wait = +wait;
    if (isNaN(wait)) wait = 300;

    // handler
    let timer = null,
      // 记录上一次func触发的时间
      previous = 0;

    /**
     * 假如每隔5ms触发一次operate，我们需要500ms执行一次func，设置一个定时器，等待495ms，执行func
     * 第10ms...如果已经存在一个定时器等待执行了，则啥都不处理即可
     * 到495ms后，把func执行了，如果此时滚动还在继续，我们还需要再设置定时器，再间隔XX时间，去执行func
     */
    return function operate(...params) {
      let now = +new Date(),
        // 当前时间和上一次执行的时间差有没有超过设置的频率wait
        remaining = wait - (now - previous);
      if (remaining <= 0) {
        // 两次触发的时间间隔超过设定的频率，则立即执行函数
        func.call(this, ...params);
        // 每次执行完函数记录最后一次执行的时间
        previous = +new Date();
        timer = clearTimeout(timer);
      } else if (!timer) {
        // 间隔时间不足设定的频率，而且还未设置等待的定时器，则设置定时器等待执行函数即可
        timer = setTimeout(() => {
          func.call(this, ...params);
          previous = +new Date();
          // 清除定时器，并且timer赋值为null，下次才能继续设置定时器
          timer = clearTimeout(timer);
        }, remaining);
      }

    };
  };

  // 渲染页面，数据绑定
  var renderList = function (data) {
    // 按照宽度240等比缩放图片 AW AH浏览器渲染的宽高，BW BH服务器获取的宽高
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

    // 每5个为一组进行数据遍历
    for (var i = 0; i < dataLen; i += 5) {
      // group:当前循环获取到的5条数据
      group = data.slice(i, i + 5);

      // 把数据按照图片的高度从小到大排序
      group.sort((a, b) => a.height - b.height);

      // 把当前页面中的5列按照高度进行排序 大->小
      columns.sort((a, b) => b.offsetHeight - a.offsetHeight);

      // 数据绑定:按照排好序的结果，分别把数据插入到指定的列中
      group.forEach((item, index) => {
        // console.log(item)
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
    // 数据绑定完成获取所有需要懒加载的盒子
    lazyImageBoxs = Array.from(doc.getElementsByClassName('item-img'));
  }

  // 单张图片延迟加载 
  // lazyImageBox：图片的盒子
  var LazyImageLoad = function LazyImageLoad(lazyImageBox) {
    var img = lazyImageBox.getElementsByTagName('img')[0],
      dataSrc = img.getAttribute('data-src');
    img.onload = function () {
      img.style.opacity = 1;
    };
    img.src = dataSrc;
    lazyImageBox.isLoad = true;
  }

  // 依次遍历每一个图片所在的盒子，所有符合条件的「出现在视口中的」都去做延迟加载
  var lazyAllImageBoxs = function lazyAllImageBoxs() {
    var winH = doc.documentElement.clientHeight;

    // 循环所有盒子
    lazyImageBoxs.forEach(lazyImageBox => {
      if (lazyImageBox.isLoad) return;
      var elemH = lazyImageBox.getBoundingClientRect().bottom;

      if (elemH <= winH) {
        LazyImageLoad(lazyImageBox);
      }
    });
  }

  init();
})(document, window);