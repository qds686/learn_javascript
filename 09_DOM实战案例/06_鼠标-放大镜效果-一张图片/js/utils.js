function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + type, function () {
      fn.call(this);
    });
  } else {
    el['on' + type] = fn;
  }
}

function removeEvent(elem, type, fn) {
  if (elem.addEventListener) {
    elem.removeEventListener(type, fn, false);
  } else if (elem.attachEvent) {
    elem.detachEvent('on' + type, fn);
  } else {
    elem['on' + type] = null;
  }
}

function getStyles(el, prop) {
  if (window.getComputedStyle) {
    if (prop) {
      return window.getComputedStyle(el, null)[prop];
    } else {
      return window.getComputedStyle(el, null);
    }
  } else {
    if (prop) {
      return el.currentStyle[prop];
    } else {
      return el.currentStyle;
    }
  }
}

function getScrollOffset() {
  if (window.pageXOffset) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset
    }
  } else {
    return {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop
    }
  }
}

function pagePos(e) {
  var sLeft = getScrollOffset().left,
    sTop = getScrollOffset().top,
    cLeft = document.documentElement.clientLeft || 0,
    cTop = document.documentElement.clientTop || 0;

  return {
    X: e.clientX + sLeft - cLeft,
    Y: e.clientY + sTop - cTop
  };
}