var xhr
t = null;

if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else {
  xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

// 以下几个时间处理函数，都有兼容问题一般不用
xhr.onloadstart = function () {
  console.log('loadstart');
}

xhr.onload = function () {
  console.log('load');
}

xhr.onerror = function () {
  console.log('error');
}

xhr.onabort = function () {
  console.log('abort');
}

xhr.onloadend = function () {
  console.log('loadend');
}

// xhr.ontimeout = function(){
//   xhr.abort();
//   xhr = null;
// }

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    clearTimeout(t);
    t = null;
  }
}

xhr.open('POST', './1.json', true);
// xhr.timeout = 30000; // 30s
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send('name=hezi&age=18');

// 超时
t = setTimeout(function () {
  xhr.abort();
  clearTimeout(t);
  t = null;
  xhr = null;
}, 30000);