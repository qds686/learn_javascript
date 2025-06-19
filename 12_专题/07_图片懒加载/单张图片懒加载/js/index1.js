; (function (win, doc) {
  var oImgList = doc.getElementsByClassName('J_imgList')[0],
    data = JSON.parse(document.getElementsByClassName('J_data')[0].innerHTML),
    imgTpl = doc.getElementById('J_imgTpl').innerHTML,
    oImgs = doc.getElementsByClassName('list-img');

  var init = function () {
    oImgList.innerHTML = renderList(data);
    bindEvent();
  }

  function bindEvent() {
    win.onscroll = function () {
      imgLazyLoad(oImgs)();
    }
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

