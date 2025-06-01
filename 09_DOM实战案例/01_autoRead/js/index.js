var sTopBtn = document.getElementsByClassName('s-top-btn')[0],
  header = document.getElementsByClassName('list-hd')[0];

// 1.给滚动条绑定滚动事件，当滚动的时候改变sTopBtn的显示隐藏
addEvent(window, 'scroll', function () {
  var sTop = getScrollOffset().top;

  sTop ? sTopBtn.style.display = 'block' : sTopBtn.style.display = 'none';
});

// 2.点击火箭回到顶部
addEvent(sTopBtn, 'click', function () {
  window.scrollTo(0, 0);
});

// 3.点击Header回到顶部
addEvent(header, 'click', function () {
  window.scrollTo(0, 0);
});