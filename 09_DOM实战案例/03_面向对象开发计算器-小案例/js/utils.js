// 绑定事件处理函数
function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + type, function () {
      fn.call(el);
    });
  } else {
    el['on' + type] = fn;
  }
}