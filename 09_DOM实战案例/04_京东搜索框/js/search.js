window.onload = function () {
  init();
}

// 管理模块的启动
function init() {
  keySearch();
}

var keySearch = (function () {
  var searchKw = document.getElementById('J_search_kw'),
    autoKw = document.getElementById('J_auto_kw'),
    recomKw = JSON.parse(document.getElementById('J_recom_kw').innerHTML),
    // 初始的关键字下标
    kwOrder = 0,
    t = null;

  // input聚焦
  addEvent(searchKw, 'focus', function () {
    // 关键字不再轮播，让文字变暗
    clearInterval(t);
    autoKw.style.color = '#ccc';
  });

  // input失去焦点
  addEvent(searchKw, 'blur', function () {
    autoKwShow(this.value, true);
    t = setInterval(autoKwChange, 3000);
  });

  // 输入事件
  addEvent(searchKw, 'input', function () {
    autoKwShow(this.value, false);
  });
  addEvent(searchKw, 'propertychange', function () {
    autoKwShow(this.value, false);
  });

  // 让关键字轮播
  function setAutoKws() {
    // 初始化 
    autoKwChange();
    t = setInterval(autoKwChange, 3000);
  }

  // 设置自动更换的关键字
  function autoKwChange() {
    var len = recomKw.length;

    autoKw.innerHTML = recomKw[kwOrder];
    kwOrder = kwOrder >= len - 1 ? 0 : kwOrder + 1;
  }

  // 当失去焦点的时候，判断关键字是否显示
  function autoKwShow(val, isBlur) {
    if (val.length <= 0) {
      autoKw.className = 'auto-kw show';
      autoKw.style.color = isBlur ? '#989898' : '#ccc';
    } else {
      autoKw.className = 'auto-kw hide';
    }
  }

  return function () {
    setAutoKws();
  }
})();