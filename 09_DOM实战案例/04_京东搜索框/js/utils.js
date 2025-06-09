// 绑定事件
function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + type, function () {
      // 指向函数this指向el
      fn.call(el);
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

// 阻止事件冒泡
function cancelBubble(e) {
  var e = e || window.event;

  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}

function preventDefaultEvent(e) {
  var e = e || window.event;
  if (e.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

// 获取鼠标点击的位置 ：pageX/Y 封装
function pagePos(e) {
  var sLeft = getScrollOffset().left,
    sTop = getScrollOffset().top,
    // IE8以上有可能是undefined，赋值为0
    // clientLeft左边框大小，在这里指的是html的margin偏移量
    cLeft = document.documentElement.clientLeft || 0,
    cTop = document.documentElement.clientTop || 0;

  return {
    // 可视区域 + 滚动条距离 - 偏移
    X: Math.floor(e.clientX + sLeft - cLeft),
    Y: Math.floor(e.clientY + sTop - cTop)
  }
}

// 获取滚动条的滚动距离
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

/**
 * 获取元素属性方法  getStyles(oDiv, 'height')
 * @param {元素节点} elem 
 * @param {String属性} prop 
 * @returns Number数字值 或者 样式集合
 */
function getStyles(elem, prop) {
  if (window.getComputedStyle) {
    if (prop) {
      return parseInt(window.getComputedStyle(elem, null)[prop]);
    } else {
      return window.getComputedStyle(elem, null);
    }
  } else {
    if (prop) {
      return parseInt(elem.currentStyle[prop]);
    } else {
      return elem.currentStyle;
    }
  }
}

// 获取浏览器真实宽高
function getScrollSize() {
  if (document.body.scrollWidth) {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    }
  } else {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    }
  }
}

// 查看浏览器窗口可视区域的宽高
function getViewportSize() {
  if (window.innerWidth) {// 包含滚动条
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {// 包含滚动条
    if (document.compatMode === 'BackCompat') {
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
    } else {
      return {//不包含滚动条
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
  }
}


// 获取当前元素距离body的左/上偏移（无论其父参照物是谁）
function getElemDocPosition(el) {
  var parent = el.offsetParent,
    offsetLeft = el.offsetLeft,
    offsetTop = el.offsetTop;

  // 存在父参照物，而且还没有找到body，虽然少算了body的边框，但是也没有问题，因为计算到父参照物的里边框，不包括边框
  while (parent && parent.tagName !== 'body') {
    // 在原有偏移的基础上累加:父参照物的边框+父参照物的偏移
    if (!/MSIE 8\.0/.test(navigator.userAgent)) {
      //IE8中偏移值自己就算了边框了，不需要我们再加边框的值
      //navigator.userAgent获取当前浏览器的版本信息
      offsetLeft += parent.clientLeft;
      offsetTop += parent.clientTop;
    }
    offsetLeft += parent.offsetLeft;
    offsetTop += parent.offsetTop;
    //继续获取上级参照物
    parent = parent.offsetParent;
  }
  return {
    left: offsetLeft,
    top: offsetTop
  }
}

// elemChildren：获取节点里面的所有元素节点
function elemChildren(node){
  var temp = {
    'length': 0,
    'push': Array.prototype.push,
    'splice': Array.prototype.splice
  },
  len = node.childNodes.length;

  for(var i=0; i<len; i++){
    var childItem = node.childNodes[i];

    if(childItem.nodeType === 1){
      temp.push(childItem);
    }
  }
  return temp;
}

// 获取节点的第N个父元素
function elemParent(node, n){
  var type = typeof(n);

  if(type === 'undefined'){
    return node.parentNode;
  }else if(n <= 0 || type !== 'number'){
    return undefined;
  }

  while(n){
    node = node.parentNode;
    n--;
  }
  return node;
}