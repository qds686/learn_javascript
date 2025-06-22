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

        // 基于getBoundingClientRect来判断图片加载的条件，不用自己写元素到BODY的上偏移的方法
        var A = imgItem.getBoundingClientRect().bottom,
          B = HTML.clientHeight;

        if (!imgItem.loaded && A <= B) {
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