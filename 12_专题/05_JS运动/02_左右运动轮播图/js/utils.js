function startMove(elem, attrObj, callback) {
  var iSpeed = null,
    iCur = null;

  clearInterval(elem.timer);

  elem.timer = setInterval(function () {
    var allStop = true;

    for (var attr in attrObj) {
      if (attr === 'opacity') {
        iCur = parseFloat(getStyles(elem, attr)) * 100;
      } else {
        iCur = parseInt(getStyles(elem, attr));
      }

      iSpeed = (attrObj[attr] - iCur) / 7;

      iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

      if (iCur !== attrObj[attr]) {
        allStop = false;
      }

      if (attr === 'opacity') {
        elem.style[attr] = (iCur + iSpeed) / 100;
      } else {
        elem.style[attr] = iCur + iSpeed + 'px';
      }
    }

    if (allStop) {
      clearInterval(elem.timer);
      typeof callback === 'function' && callback();
    }
  }, 30);
}

function addEvent(el, type, fn){
  if(el.addEventListener){
  	el.addEventListener(type, fn, false);
  }else if(el.attachEvent){
  	el.attachEvent('on' + type, function(){
  		fn.call(el);
  	})
  }else{
  	el['on' + type] = fn;
  }
}

function removeEvent(elem, type, fn){
  if(elem.addEventListener){
    elem.removeEventListener(type, fn, false);
  }else if(elem.attachEvent){
    elem.detachEvent('on' + type, fn);
  }else{
    elem['on' + 'type'] = null;
  }
}

function cancelBubble(e){
  var e = e || window.event;

  if(e.stopPropagation){
    e.stopPropagation();
  }else{
    e.cancelBubble = true;
  }      
}

function preventDefaultEvent(e){
  var e = e || window.event;
  if(e.preventDefault){
    event.preventDefault();
  }else{
    event.returnValue = false;
  }
}

function getScrollOffset(){
  if(window.pageXOffset){
    return {
      left: window.pageXOffset,
      top: window.pageYOffset
    }
  }else{
    return {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop
    }
  }
}

function getStyles(elem, prop){
  if(window.getComputedStyle){
    if(prop){
      return parseInt(window.getComputedStyle(elem, null)[prop]);
    }else{
      return window.getComputedStyle(elem, null);
    }
    
  }else{
    if(prop){
      return parseInt(elem.currentStyle[prop]);
    }else{
      return elem.currentStyle;
    }
  }
}

function elemDrag(elem){
  var x,
      y;

  addEvent(elem, 'mousedown', function(e){
    var e = e || window.event;
    x = pagePos(e).X - getStyles(elem, 'left');
    y = pagePos(e).Y - getStyles(elem, 'top');

    addEvent(document, 'mousemove', mouseMove);
    addEvent(document, 'mouseup', mouseUp);
    cancelBubble(e);
    preventDefaultEvent(e);
  });

  function mouseMove(e){
    var e = e || window.event;

    elem.style.left = pagePos(e).X - x + 'px';
    elem.style.top = pagePos(e).Y - y + 'px';
  }

  function mouseUp(e){
    var e = e || window.event;
    removeEvent(document, 'mousemove', mouseMove);
    removeEvent(document, 'mouseup', mouseUp);
  }
}

function pagePos (e){
  var sLeft = getScrollOffset().left,
      sTop = getScrollOffset().top,
      cLeft = document.documentElement.clientLeft || 0,
      cTop = document.documentElement.clientTop || 0;
  
  return {
    X: e.clientX + sLeft - cLeft,
    Y: e.clientY + sTop - cTop
  }
}

function getViewportSize(){
  if(window.innerWidth){
    return{
      width: window.innerWidth,
      height: window.innerHeight
    }
  }else{
    if(document.compatMode === 'BackCompat'){
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
    }else{
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
  }
}

function setTplToHTML(tpl, regExp, opt){
  return tpl.replace(regExp(), function(node, key){
    return opt[key];
  });
}

function regTpl(){
  return new RegExp(/{{(.*?)}}/, 'gim');
}
