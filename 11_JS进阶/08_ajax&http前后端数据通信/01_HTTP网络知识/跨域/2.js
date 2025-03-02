// iframe1 iframe2 iframe3
/* 
iframe；
1.设置窗口的名字：window.name
2.获取指定iframe窗口：
  myIframe = document.getElementById('myIframe');
  // 当页面加载完成
  myIframe.onload = function () {
    console.log(myIframe.contentWindow.name);
  }
3.
子访问父：window.name 「window代表父iframe」
子访问爷：window.parent.name

同源：
=> 不同窗口，多个页面：iframe可以通过window.name可以互相之间传值
=> 同一窗口，多个页面：window.name 有共享性

跨域：页面之间无法共享值，并报错
*/
var s = xxx;



