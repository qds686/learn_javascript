/* 
同源策略请求 && 非同源策略(跨域)请求
  HTML页面预览的地址：http://127.0.0.1:5500/index.html
  基于Ajax发送请求的数据接口地址：http://127.0.0.1:8888/user/list
1.定义
如果两个地址的“协议、域名、端口号”完全一致，则是同源请求，只要有一个不一样，则就是跨域请求
  + 同源请求：把文本页面和后台的接口程序部署在“相同的服务器的相同服务下”
  + 跨域请求：页面和后台分开部署「同一台服务器的不同端口下 或者 不同服务器下...」
2.项目场景：
+ 开发的时候：我们在自己的电脑上启动服务预览项目，但是后台的程序在其他的服务器上，没有在一起，此时的数据请求就是“跨域”的
+ 部署到服务器：
  + 全部署在一起(相同服务器的相同服务下)，此时就是同源「不建议」
  + 当代部署一般都是分服务器部署，也就是页面和后台是部署在不同服务器上的，此时就是跨域
3.Ajax跨域请求
默认情况下不允许Ajax跨域请求，因为浏览器有“安全策略”，不同源访问会报错：
  Access to XMLHttpRequest at 'http://study.hy.com/server.php' from origin 'http://test.hy.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  + Access to XMLHttpRequest at：请求跨域
  + 地址：http://study.hy.com/server.php
  + from origin 'http://test.hy.com'：请求来自源http://test.hy.com
  + has been blocked by CORS policy：被跨域资源共享策略（Cross-origin resource sharing）阻止
  + No 'Access-Control-Allow-Origin' header is present on the requested resource
    + 在请求的资源中没发现允许跨域的头信息
服务器和服务器之间默认是没有跨域限制的

4.非同源策略(跨域)请求方案：
4.1 proxy跨域代理
  原理：利用“服务器和服务器之间不存在跨域”来实现的
  步骤：
    @1 Vue和React项目中使用webpack-dev-server在本地启动一个服务：一方面可以实现页面的预览，另一方面也可以代理转发数据请求
    @2 再发送数据请求，发送给本地启动的这个服务，而这个服务会去真正的服务器上获取相关的数据，再返回给客户端
  部署：
    本地开发的时候，我们基于proxy跨域代理来完成
    部署到服务器的时候，一般是基于Nginx的反向代理来处理
  // vue.config.js
    divServer: {
      // 根据前缀的不同，代理到不同的服务器
      "/api": {
        // 所有以^/api开始的请求，都发送到代理服务器
        target: "https://www.xx.com/xx",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }

4.2 CORS跨域资源共享：默认因为浏览器的安全策略，是不允许Ajax跨域访问的，但是如果服务器设置了Access-Control-Allow-Origin响应头信息，设置允许这个源发送请求，那么浏览器也就不再去限制了
  步骤：
  @1 由服务器设置允许源
    Access-Control-Allow-Origin 设置允许的源「白名单机制」
    Access-Control-Allow-Credentials 是否允许携带资源凭证「例如：cookie」
      服务器端设置了允许，则客户端也要配合设置允许
      axios.defaults.withCredentials = true;
      xhr.withCredentials = true;
    Access-Control-Allow-Headers 设置允许的请求头
    Access-Control-Allow-Methods 设置允许的请求方式
  @2 在CORS跨域共享中，客户端首先会尝试发送一个options试探请求，验证是否连接成功，连接成功后，再发送真正的请求

4.3 JSONP跨域解决方案
  原理：利用了script标签不存在域的限制来实现的，同样的img/link/iframe等标签也不存在域的限制
  步骤：
    @1 基于script标签的src指定请求的地址，实现请求的发送「没有域的限制」；我们会创建一个全局函数，在发送请求的时候，会基于问号传参，把全局函数名基于callback传递给服务器
      const fn=function fn(data){
        // ...
      };
      <script src='http://127.0.0.1:1001/list?callback=fn'>
    @2 服务器会收到对应的请求，并且基于callback获取传递过来的函数名
      + 准备数据 [{id:1,name:'xxx'},{id:2,name:'xxx'},...]
      + 把函数名和数据拼接在一起，成为指定格式的字符串 
        'fn([{id:1,name:'xxx'},{id:2,name:'xxx'},...])'
      + 最后返回给客户端这个字符串
    @3 客户端获取到 'fn(...)' 字符串，因为基于<script>发送的，所以会默认把其当做JS代码执行
      + 也就是把全局函数fn执行，并且把服务器准备的数据当做实参传递给了函数
      + fn如果是私有的，在此处执行的时候，找不到私有的fn
*/

// JSONP

// 前端动态创建全局函数和script，这样操比较麻烦
// 封装一个jsonp方法「基于promise管理」，执行这个方法可以发送jsonp请求
// const func = function func(data) {
//   console.log('请求成功:', data);
// };
// <script src="http://127.0.0.1:1001/user/list?callback=func"></script>

/* 
封装一个jsonp方法「基于promise管理」，执行这个方法可以发送jsonp请求
  jsonp([url], [options])
  + params:null/对象 问号参数信息
  + jsonpName:'callback' 基于那个字段把全局函数名传递给服务器
  + ...

例如：
jsonp('http://127.0.0.1:1001/user/list', {
  params: {
    lx:0,
    name: 'hezi'
  },
  jsonp: 'cb'
})
*/

// 把对象变为urlencoded格式字符串 xxx=xxx&xxx=xxx
const stringify = function stringify(obj) {
  // 获取所有的私有属性，返回数组
  let keys = Reflect.ownKeys(obj),
    str = ``;
  keys.forEach(key => {
    str += `&${key}=${obj[key]}`
  });
  return str.substring(1);
};

const jsonp = function jsonp(url, options) {
  // 格式校验 && 合并默认配置项
  if (typeof url !== 'string') throw new TypeError('url is not a string');

  if (isPlainObject(options)) options = {};
  let { params, jsonpName } = Object.assign({
    params: null,
    jsonpName: 'callback'
  }, options);

  // 返回一个promise实例
  return new Promsie((resolve, reject) => {
    // 移除创建的全局函数&script标签
    const clear = () => {
      delete window[name];
      document.body.removeChild(script);
    }

    // 创建全局函数「不能导致全局变量污染」
    const name = `jsonp${+new Date()}`;

    // 发送请求

    // 浏览器接收到响应后，会自动执行这个 JavaScript 代码片段「创建的全局函数」，从而调用 window[name] 函数，并将服务器获取的结果 data 作为参数传递给它
    window[name] = function (data) {
      resolve(data);
      clear();
    };

    // 处理URL参数：把params拼接上 & 把全局函数名也拼接上
    if (isPlainObject(params)) {
      // 把对象变为urlencoded格式字符串
      params = stringify(params);
      url += `${url.includes("?") ? "&" : "?"}${params}`;
    }
    url += `${url.includes("?") ? "&" : "?"}${jsonpName}=${name}`;

    // 动态创建script标签，向服务器发送请求
    const script = document.createElement("script");
    script.src = url;
    script.onerror = () => {
      // 请求失败
      reject();
      clear();
    };
    document.body.appendChild(script);
  });
};

// 使用jsonp函数发送请求
jsonp('http://127.0.0.1:1001/user/list')
  .then(value => {
    console.log('请求成功:', value);
  });





