Element.prototype.dragNclick = (function (menu, elemClick) {
  // 记录单击的时间和位置
  // 开始时间
  var beginTime = 0,
    // 结束时间
    endTime = 0,
    // 记录点击之前的位置
    originPos = [],
    // 双击的时间
    cBeginTime = 0,
    cEndTime = 0,
    counter = 0,
    t = null,
    // 拖拽判断边界
    minL = 0,
    minT = 0,
    wWidth = getViewportSize().width,
    wHeight = getViewportSize().height,
    elemWidth = getStyles(this, 'width'),
    elemHeight = getStyles(this, 'height'),
    // 用getStyles 和 elem.offsetWidth 都会出现滚动条的现象，-1避免出现滚动条
    maxL = wWidth - elemWidth - 1,
    maxT = wHeight - elemHeight - 1,
    // 右键判断边界
    menuWidth = getStyles(menu, 'width'),
    menuHeight = getStyles(menu, 'height');

  drag.call(this);

  function drag() {
    var x,
      y,
      _self = this;

    addEvent(this, 'mousedown', function (e) {
      var e = e || window.event,
        // mousedown mouseup可以触发鼠标的左中右键 分别是0 1 2 
        // click只能触发左键
        btnCode = e.button;

      if (btnCode === 2) {
        // 右键
        var mLeft = pagePos(e).X,
          mTop = pagePos(e).Y;

        if (mLeft <= 0) {
          mLeft = 0;
        } else if (mLeft > wWidth - menuWidth) {
          mLeft = pagePos(e).X - menuWidth;
        }

        if (mTop <= 0) {
          mTop = 0;
        } else if (mTop > wHeight - menuHeight) {
          mTop = pagePos(e).Y - menuHeight;
        }

        menu.style.left = mLeft + 'px';
        menu.style.top = mTop + 'px';
        // 这里需要阻止默认的右键
        menu.style.display = 'block';
      } else if (btnCode === 0) {
        // 左键
        // 记录鼠标按下的时间戳
        beginTime = new Date().getTime();
        originPos = [getStyles(_self, 'left'), getStyles(_self, 'top')];
        menu.style.display = 'none';

        x = pagePos(e).X - getStyles(_self, 'left');
        y = pagePos(e).Y - getStyles(_self, 'top');

        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        cancelBubble(e);
        preventDefaultEvent(e);
      }
    });

    // 阻止默认的右键
    addEvent(document, 'contextmenu', function (e) {
      var e = e || window.event;
      preventDefaultEvent(e);
    });
    // 点击文档右键消失
    addEvent(document, 'click', function (e) {
      menu.style.display = 'none';
    });
    // 点击menu阻止事件冒泡到document，点击menu右键不会消失
    addEvent(menu, 'click', function () {
      var e = e || window.event;
      cancelBubble(e);
    });

    function mouseMove(e) {
      var e = e || window.event,
        curL = pagePos(e).X - x,
        curT = pagePos(e).Y - y;

      curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
      curT = curT < minT ? minT : (curT > maxT ? maxT : curT);

      _self.style.left = curL + 'px';
      _self.style.top = curT + 'px';
    }

    function mouseUp(e) {
      var e = e || window.event;
      // 鼠标抬起的时候获取时间戳
      endTime = new Date().getTime();

      // 点击事件
      if (endTime - beginTime < 100) {
        // 点击的时候防止点击与拖拽同时发生，移动了盒子的位置
        _self.style.left = originPos[0] + 'px';
        _self.style.top = originPos[1] + 'px';

        counter++;

        if (counter === 1) {
          cBeginTime = new Date().getTime();
        }

        if (counter === 2) {
          cEndTime = new Date().getTime();
        }

        // 只有双击的时候执行函数跳转
        if (cBeginTime && cEndTime && (cEndTime - cBeginTime < 200)) {
          elemClick();
          cBeginTime = 0;
          cEndTime = 0;
          counter = 0;
        }

        t = setTimeout(function () {
          cBeginTime = 0;
          cEndTime = 0;
          counter = 0;
          clearTimeout(t);
        }, 500);
      }
      removeEvent(document, 'mousemove', mouseMove);
      removeEvent(document, 'mouseup', mouseUp);
    }
  }
});

