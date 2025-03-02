/* 
ajax核心：基于XMLHttpRequest创建HTTP请求
  1.创建xhr实例
  2.打开一个URL地址，发送请求前的一些配置信息
    + method 请求方式：get/post
    + url 请求的URL地址
      + url是相对路径，表示请求当前HTML文件所在目录中的json/1.json
    + async 是否采用异步，默认是true
    + username 
    + userpass
  3.监听请求的过程，在不同的阶段做不同的处理「包含获取服务器的响应信息」
    + Ajax状态 xhr.readyState
      + 0 UNSENT 
      + 1 OPENED 
      + 2 HEADERS_RECEIVED 响应头信息已经返回
      + 3 LOADING 响应主体信息正在处理
      + 4 DONE 响应主体信息已经返回
    + HTTP状态码 xhr.status/xhr.satatusText
    + 获取响应主体信息 
      xhr.response
      xhr.responseText
      xhr.responseXML
    + 获取响应头信息
      xhr.getResponseHeader 获取指定响应头信息
      xhr.getAllResponseHeaders 获取所有响应头信息
  4.发送请求，send中传递的信息，就是设置的请求主体的信息
    基于请求主体传递给服务器的数据格式是有要求的
    1.form-data 主要应用于文件的上传或者表单数据提交
      xhr.setRequestHeader('Content-Type', 'multipart/form-data')
      let fd = new FormData;
      fd.append('lx', 0);
      fd.append('name', 'xxx');
      xhr.send(fd);
    2.x-www-form-urlencoded格式的字符串
      格式：“lx=1&name=xxx” 「常用」
      Qs库：$npm i qs
      Qs.stringify/parse:实现对象和urlencoded格式字符串之间的转换
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(Qs.stringify({
          lx: 0,
          name: 'xxx'
        }));
    3.raw：字符串格式
      普通字符串 -> text/plain
      json字符串 -> application/json => JSON/stringify/parse 「常用」
      XML格式字符串 -> application/xml
    4.binary进制数据文件「buffer / 二进制」
      一般也应用于文件上传
      图片 -> image/jpeg
      excel -> application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    5.GraphQL
*/
/* 
get和post的区别？
1.传参
  + get请求传递给服务器的信息，除了请求头传递以外，要求基于URL问号传参传递给服务器
    xhr.open('get', './json/1.json?lx=1&name=xxx');
  + post请求要求传递给服务器的信息，是基于请求主体传递
    xhr.send(lx=1&name=xxx)
2.get传递的信息不如post多
  + URL有长度限制(IE是2KB)，get请求超过这个长度的信息回被自动截掉，这样导致传递内容过多，最后服务器收到的信息是不完整的
  + post理论上是没有限制的，但是传递的东西越多，速度越慢，可能导致浏览器报传输超时的错误，所以实际上我们会自己手动做限制
3.get会产生缓存「浏览器默认产生的，不可控的缓存」
  + 两次及以上，请求相同的API接口，并且传递的参数也一样，浏览器可能会把第一次请求的信息直接返回，而不是从服务器获取最新的信息
  + 解决方法：在请求URL的末尾设置随机数，以此来清除get缓存的副作用
    xhr.open('get', './json/1.json?lx=1&name=xxx'+Math.random());
4.post相对于get更安全
  get传递的信息是基于URL末尾拼接，很容易被修改，所以传递信息都要手动加密
*/
let xhr = new XMLHttpRequest;
xhr.open('get', './1.json');
// 设置请求头信息，超时时间，携带资源凭证需要再open之后send之前
// 可以在请求中设置信息，但是不允许出现中文
xhr.setRequestHeader('name', 'hezi');
xhr.setRequestHeader('Content-Type', 'multipart/form-data');
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};

xhr.send(Qs.stringify({
  lx: 0,
  name: 'xxx'
}));

