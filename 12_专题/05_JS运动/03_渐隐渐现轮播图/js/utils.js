function addEvent(el, type, fn){
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