/* 
基于 IntersectionObserver 来实现延迟加载
  + 监听某些DOM元素(可以同时监听很多元素)与浏览器可视窗口交叉位置的状态信息
*/
/* 
设置一个监听器，后期可以监听指定的DOM元素(可以是多个)，当监听的DOM元素与可视窗口的交叉位置状态发生改变，触发回调函数执行 -> changes是一个数组集合，集合中存储每一个DOM元素与可视窗口交叉状态信息
let obj = new IntersectionObserver(changes => {
  console.log(changes[0]);
  默认：第一次监听完DOM触发一次、元素刚开始出现在页面中触发一次、元素完全消失在页面中触发一次
  changes返回数组 IntersectionObserverEntry 每一个DOM元素与可是窗口交叉的信息
    + changes[0] 表示监听的第一个DOM元素
    + boundingClientRect 获取的就是基于 每个img的getBoundingClientRect() 获取的结果
    + target 当前监听的DOM元素
    + isIntersecting 是否和可视窗口交叉了「布尔」如果为true说明元素出现在可视窗口中，反之如果为false说明不在可视窗口中
}, {
  基于threshold配置项，控制触发监听的条件，数组中可以写多个
    + 0 刚出现
    + 0.5 出现了一半
    + 1 完全出现
  threshold: [0, 0.5, 1]
});
*/
/* 
基于IntersectionObserver实现延迟加载 相对于 之前基于window.onscroll实现延迟加载的优势
  + 实现起来更方便
  + onscroll方法中需要自己编写throttle函数进行节流处理，依次优化性能；但是IntersectionObserver内置节流处理，而且性能上比onscroll也好很多
  + 弊端：兼容性不好，IE中只有Edge新版本兼容，其余都不兼容，火狐谷歌等也都是 >=60 左右的新版本才兼容，所以移动端开发目前使用的比较多
*/
; (function (doc, win) {
  var oImgList = doc.getElementsByClassName('J_imgList')[0],
    data = JSON.parse(document.getElementsByClassName('J_data')[0].innerHTML),
    imgTpl = doc.getElementById('J_imgTpl').innerHTML,
    oImgs = doc.getElementsByClassName('list-img');

  var init = function () {
    oImgList.innerHTML = renderList(data);
    createObserver(oImgs);
  };

  function createObserver(images) {
    var images = Array.from(images),
      options = {
        threshold: [1]
      },
      ob;

    ob = new IntersectionObserver(changes => {
      // item就是监听的DOM元素与窗口的交叉信息
      // target就是当前监听的img元素

      changes.forEach(item => {
        if (item.isIntersecting) {
          // 符合条件：盒子已经完全出现在视口中
          imgLazyLoad(item.target);
          // 处理过一次延迟加载，以后当前这个元素无需再次监听处理了
          ob.unobserve(item.target);
        }
      });
    }, options);
    images.forEach(elem => {
      // 监听DOM元素
      ob.observe(elem);
      // 解除监听
      // ob.unobserve(elem);
    });
  }

  function renderList(data) {
    var list = '';
    data.forEach(item => {
      return list += imgTpl.replace(/{{(.*?)}}/g, function (node, key) {
        return {
          pic: item.pic,
          id: item.id
        }[key]
      });
    });
    return list;
  }

  function imgLazyLoad(img) {
    // 只处理未加载过的图片
    var lazyImage = img.getAttribute('data-src');
    // src属性即使为空，img.src浏览器也会解析为这个文件的绝对地址，不是空
    if (lazyImage) {
      img.onload = function () {
        // 这里也可以加类添加样式
        img.style.opacity = 1;
      };
      img.src = lazyImage;
      img.removeAttribute('data-src');
    }
  }

  init();
})(document, window);