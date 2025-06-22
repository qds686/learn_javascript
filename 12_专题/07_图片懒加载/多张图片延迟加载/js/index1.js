/* 
图片延迟加载
  在没有加载真实的图片之前，图片区域用默认的背景图(背景色)占位即可
  首屏：先加载首屏中的其他数据（内容、样式、文本等，等待其他数据加载完成，再去加载真实的图片
  其他屏：滚动到对应的区域（一露面、出来一半、完全出现在屏幕中）再去加载真实的图片

问题：如果不做延迟加载，那么页面渲染的时候，同时也要把图片资源请求回来，并且进行渲染，这样会阻碍页面的渲染进度，导致首次加载页面速度很慢
意义：延迟加载可以提高页面的加载速度、可以减少用户没必要的网络消耗

在浏览器滚动条滚动「页面滚动」过程中，等待图片完全出现在可视窗口内的时候，我们加载真实图片 “非首屏图片的处理” -> 计算出盒子底边距离BODY的距离A 和 浏览器底边距离BODY的距离B 作比较，A ≤ B 加载真实图片 

也有在不论图片是否加载成功，只要处理过，则就把lazy-image属性移除掉「证明其已经处理过了」

onscroll特点：只要页面滚动就会触发「在浏览器最快的反应时间内，谷歌4-6MS，触发频率会特别的频繁」，这样导致的问题：
1.重复加载：A <= B这个条件，只要页面一直向上滚动，在第一次符合条件后，每次滚动条件也都是符合的，这样lazyImage方法会被执行多次「也就是延迟加载的操作会被处理很多次」
  + 因为属性data-src第一次已经移除了，下一次进来为null，用自定义属性进行判断
  + isLoad=true说明图片已经处理了，不再进行延迟加载
2.处理频率太快了，需要降低它的频率，函数的节流throttle
*/
; (function (win, doc) {
  var oImgList = doc.getElementsByClassName('J_imgList')[0],
    data = JSON.parse(document.getElementsByClassName('J_data')[0].innerHTML),
    imgTpl = doc.getElementById('J_imgTpl').innerHTML,
    oImgs = doc.getElementsByClassName('list-img');

  var init = function () {
    oImgList.innerHTML = renderList(data);
    bindEvent();
    // 每次刷新页面，跳转到首屏
    setTimeout(function () {
      win.scrollTo(0, 0);
    }, 150);
  }

  function bindEvent() {
    win.onload = win.onscroll = _.throttle(function () {
      // 节流onscroll
      imgLazyLoad(oImgs)();
    });
  }

  function renderList(data) {
    var list = '';

    data.forEach(function (elem) {
      list += imgTpl.replace(/{{(.*?)}}/g, function (node, key) {
        return {
          pic: elem.pic,
          id: elem.id
        }[key];
      });
    });

    return list;
  }

  function imgLazyLoad(images) {
    var imgLen = images.length,
      HTML = document.documentElement;

    return function () {
      var cHeight = HTML.clientHeight,
        sTop = HTML.scrollTop || document.body.scrollTop,
        imgItem;

      for (var i = 0; i < imgLen; i++) {
        imgItem = images[i];

        var A = _.getElemDocPosition(imgItem).top + imgItem.offsetHeight,
          B = cHeight + sTop;

        if (!imgItem.loaded && A <= B) {

          // 循环结束，此处imgItem已经指向最后一个，需要闭包
          imgItem.onload = function () {
            this.style.opacity = 1;
          };
          imgItem.src = imgItem.getAttribute('data-src');
          imgItem.removeAttribute('data-src');
          imgItem.loaded = true;
        }
      }
    }
  }

  init();
})(window, document);