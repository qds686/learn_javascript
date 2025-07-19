window.onload = function () {
  init();
}

function init() {
  initMagnifier();
}

var initMagnifier = (function () {
  var oImgWrap = document.getElementsByClassName('img-wrap')[0],
    oMagWrap = oImgWrap.getElementsByClassName('mag-wrap')[0],
    oMagImg = oMagWrap.getElementsByClassName('mag-img')[0],
    magWidth = parseInt(getStyles(oMagWrap, 'width')),
    magHeight = parseInt(getStyles(oMagWrap, 'height')),
    // 获取Wrap到body的偏移量
    imgX = oImgWrap.offsetLeft,
    imgY = oImgWrap.offsetTop;

  addEvent(oImgWrap, 'mouseover', function (e) {
    var e = e || window.event,
      x = pagePos(e).X - imgX - magWidth / 2,
      y = pagePos(e).Y - imgY - magHeight / 2;

    // 让鼠标在小盒子的中心，设置移动过程中小盒子的位置
    // 小盒子向下，则里面的img要向反方向移动
    showMag(getXY(e).x, getXY(e).y);

    // 移入oImgWrap让oMagWrap显示
    oMagWrap.className = 'mag-wrap show';
    addEvent(document, 'mousemove', mouseMove);
  });

  addEvent(oImgWrap, 'mouseout', mouseOut);

  function mouseMove(e) {
    showMag(getXY(e).x,
      getXY(e).y,
      getXY(e).mouseX,
      getXY(e).mouseY
    );
  }

  function mouseOut(e) {
    oMagWrap.className = 'mag-wrap';
    // 涉及到mousemove或者mouseup都要解绑
    removeEvent(document, 'mousemove', mouseMove);
  }

  function getXY(e) {
    var e = e || window.event;

    return {
      x: pagePos(e).X - imgX - magWidth / 2,
      y: pagePos(e).Y - imgY - magHeight / 2,
      mouseX: pagePos(e).X - imgX,
      mouseY: pagePos(e).Y - imgY
    };
  }

  function showMag(x, y, mouseX, mouseY) {
    var imgWrapWidth = parseInt(getStyles(oImgWrap, 'width')),
      imgWrapHeight = parseInt(getStyles(oImgWrap, 'height'));

    // 判断鼠标是否在图片区域内
    if (mouseX && mouseY) {
      if (mouseX < 0 || mouseX > imgWrapWidth ||
        mouseY < 0 || mouseY > imgWrapHeight) {
        oMagWrap.className = 'mag-wrap';
      }
    }

    oMagWrap.style.left = x + 'px';
    oMagWrap.style.top = y + 'px';
    oMagImg.style.left = -x + 'px';
    oMagImg.style.top = -y + 'px';
  }
});