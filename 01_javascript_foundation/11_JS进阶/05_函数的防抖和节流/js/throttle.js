const func = function func(){
  console.log('ok');
}

// window.onscroll有一个自己默认的触发频率：浏览器的最快反应时间「谷歌：5-7ms」
// window.onscroll = func; // 这样当滚动条滚动的时候会不停地触发事件触发然后执行函数func
window.onscroll = utils.throttle(func, 500);