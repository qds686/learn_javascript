window.onload = function () {
  init();
}

function init() {
  initMagifier();
}

/* 
  鼠标进入小图，Mark和大图显示，并且动态计算大图的宽高
  使鼠标在Mark中间位置，设置left和top值
  鼠标移动的时候，动态计算Mark的left和top，大图需要有比例设置
*/
var initMagifier = (function () {
  var oImgWrap = document.getElementsByClassName('img-wrap')[0],
    oMagWrap = oImgWrap.getElementsByClassName('mag-wrap')[0],
    oMagImg = oMagWrap.getElementsByClassName('mag-img')[0],
    oMark = oMagWrap.getElementsByClassName('mark')[0],
    oImgLk = oImgWrap.getElementsByClassName('img-lk')[0],
    oStaticImg = oImgLk.getElementsByClassName('static-img')[0],

    magWidth = parseInt(getStyles(oMagWrap, 'width')),
    magHeight = parseInt(getStyles(oMagWrap, 'height')),
    markWidth = parseInt(getStyles(oMark, 'width')),
    markHeight = parseInt(getStyles(oMark, 'height')),
    imgLkWidth = parseInt(getStyles(oImgLk, 'width')),
    imgLkHeight = parseInt(getStyles(oImgLk, 'height')),
    // 大图宽高需要动态计算
    staticImgWidth = 0,
    staticImgHeight = 0,

    // 获取Wrap到body的偏移量
    imgX = oImgWrap.offsetLeft,
    imgY = oImgWrap.offsetTop;

  staticImgWidth = imgLkWidth / (markWidth / magWidth);
  staticImgHeight = imgLkHeight / (markHeight / magHeight);

  oStaticImg.style.width = staticImgWidth + 'px';
  oStaticImg.style.height = staticImgHeight + 'px';

  addEvent(oMagWrap, 'mouseenter', function (e) {
    var e = e || window.event;

    oMark.style.display = 'block';
    oImgLk.style.display = 'block';
    computed(e);
    addEvent(oMark, 'mousemove', mouseMove);
  });

  addEvent(oMagWrap, 'mouseleave', mouseLeave);

  function mouseMove(e) {
    var e = e || window.event;
    computed(e);
  }

  function computed(e) {
    var e = e || window.event,
      curL = pagePos(e).X - imgX - markWidth / 2,
      curT = pagePos(e).Y - imgY - markHeight / 2,
      minL = 0,
      minT = 0,
      maxL = magWidth - markWidth,
      maxT = magHeight - markHeight;

    curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
    curT = curT < minT ? minT : (curT > maxT ? maxT : curT);

    oMark.style.left = curL + 'px';
    oMark.style.top = curT + 'px';
    oStaticImg.style.left = -curL / magWidth * staticImgWidth + 'px';
    oStaticImg.style.top = -curT / magHeight * staticImgHeight + 'px';
  }

  function mouseLeave(e) {
    var e = e || window.event;

    oMark.style.display = 'none';
    oImgLk.style.display = 'none';
    removeEvent(document, 'mousemove', mouseMove);
  }
});