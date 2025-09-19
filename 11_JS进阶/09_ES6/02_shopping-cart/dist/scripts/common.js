// 100px, 14px可以用0.14rem表示
document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px'; 

window.addEventListener('load', function () {
  FastClick.attach(document.body);
});